import React, { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Code, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddSkillsModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    userSkills: string[]
    lastUpdated?: string
    onSkillsUpdated?: () => void
}

function isOlderThan60Days(dateString: string | undefined) {
    if (!dateString) return true
    const last = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - last.getTime()
    return diff > 60 * 24 * 60 * 60 * 1000 // 60 days in ms
}

const API_URL = process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({
    isOpen,
    onClose,
    userId,
    userSkills,
    lastUpdated,
    onSkillsUpdated
}) => {
    const [skills, setSkills] = useState<string[]>(userSkills)
    const [inputValue, setInputValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [removing, setRemoving] = useState<string | null>(null)
    const { toast } = useToast()
    const inputRef = useRef<HTMLInputElement>(null)

    // Show warning if no skills or not updated in 60 days
    const showWarning = skills.length === 0 || isOlderThan60Days(lastUpdated)

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault()
        const skill = inputValue.trim()
        if (!skill || skills.includes(skill)) return
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/prepyatra/userskills`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, userSkills: [skill] })
            })
            const result = await res.json()
            if (result.status) {
                setSkills((prev) => [...prev, skill])
                setInputValue("")
                toast({
                    title: "Skill added!",
                    description: `${skill} added to your stack.`
                })
                if (onSkillsUpdated) onSkillsUpdated()
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to add skill.",
                    variant: "destructive"
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to add skill.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }

    const handleRemoveSkill = async (skill: string) => {
        setRemoving(skill)
        try {
            // Remove skill from backend (implement API if needed)
            // For now, just remove locally
            setSkills((prev) => prev.filter((s) => s !== skill))
            toast({
                title: "Skill removed",
                description: `${skill} removed from your stack.`
            })
            if (onSkillsUpdated) onSkillsUpdated()
        } finally {
            setRemoving(null)
        }
    }

    if (!isOpen) return null

    return createPortal(
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className='fixed inset-0 flex items-center justify-center z-[99999] bg-black/60'>
                <div className='bg-gray-900 rounded-2xl p-10 w-full max-w-2xl min-h-[400px] shadow-xl relative z-[100000]'>
                    <button
                        className='absolute top-4 right-4 text-gray-400 hover:text-red-400'
                        onClick={onClose}
                        aria-label='Close'>
                        <X className='w-6 h-6' />
                    </button>
                    <h2 className='text-2xl font-bold text-white mb-4 flex items-center gap-2'>
                        <Plus className='w-5 h-5 text-primary' /> Add Skills
                    </h2>
                    {showWarning && (
                        <div className='flex items-center gap-2 bg-yellow-900/80 border border-yellow-600 text-yellow-300 rounded-lg px-4 py-2 mb-4'>
                            <AlertTriangle className='w-5 h-5 text-yellow-400' />
                            <span>
                                {skills.length === 0
                                    ? "You haven't added any skills yet. Please add your skills to build your stack!"
                                    : "You haven't updated your stack in over 60 days. Keep your skills up to date!"}
                            </span>
                        </div>
                    )}
                    <form onSubmit={handleAddSkill} className='flex gap-2 mb-4'>
                        <input
                            ref={inputRef}
                            type='text'
                            className='flex-1 rounded-lg px-4 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary'
                            placeholder='Type a skill and press Enter...'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={loading}
                            maxLength={32}
                        />
                        <Button
                            type='submit'
                            disabled={loading || !inputValue.trim()}
                            className='bg-primary text-primary-foreground hover:bg-primary/90'>
                            {loading ? (
                                <span className='animate-spin'>⏳</span>
                            ) : (
                                <Plus className='w-4 h-4' />
                            )}
                        </Button>
                    </form>
                    <div className='flex flex-wrap gap-2 mb-4'>
                        {skills.length === 0 && (
                            <span className='text-gray-400 text-sm'>
                                No skills added yet. Start building your stack!
                            </span>
                        )}
                        {skills.map((skill) => (
                            <Badge
                                key={skill}
                                className='flex items-center gap-2 bg-primary/20 text-primary font-semibold px-4 py-1.5 rounded-full border border-primary/40 transition hover:bg-primary/40 hover:border-primary hover:text-primary-foreground cursor-pointer shadow-none'>
                                <Code className='w-4 h-4 text-primary' />
                                <span>{skill}</span>
                                <button
                                    type='button'
                                    className='ml-2 text-primary/70 hover:text-red-400 focus:outline-none'
                                    onClick={() => handleRemoveSkill(skill)}
                                    disabled={removing === skill}>
                                    <X className='w-3 h-3' />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <Button
                        onClick={onClose}
                        className='w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90'>
                        Done
                    </Button>
                </div>
            </div>
        </Dialog>,
        document.body
    )
}

export default AddSkillsModal
