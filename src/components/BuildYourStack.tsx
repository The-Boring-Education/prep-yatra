import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Code, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BuildYourStackProps {
    userId: string
    userSkills: string[]
    onSkillsUpdated?: () => void
    lastUpdated?: string;
}

const API_URL = import.meta.env.VITE_TBE_WEBAPP_API_URL;

function isOlderThan60Days(dateString: string | undefined) {
    if (!dateString) return true;
    const last = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - last.getTime();
    return diff > 60 * 24 * 60 * 60 * 1000; // 60 days in ms
}

const BuildYourStack: React.FC<BuildYourStackProps> = ({ userId, userSkills, onSkillsUpdated, lastUpdated }) => {
    const [skills, setSkills] = useState<string[]>([])
    const [inputValue, setInputValue] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const inputRef = useRef<HTMLInputElement>(null)
    
    useEffect(() => {
        setSkills(userSkills || [])
    }, [userSkills])

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
                setInputValue("")
                toast({ title: "Skill added!", description: `${skill} added to your stack.` })
                if (onSkillsUpdated) onSkillsUpdated()
            } else {
                toast({ title: "Error", description: result.message || "Failed to add skill.", variant: "destructive" })
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to add skill.", variant: "destructive" })
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }
        
    const showWarning = (skills.length === 0) || isOlderThan60Days(lastUpdated);

    return (
        <div className="glass-dark rounded-2xl p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Build Your Stack
            </h3>
            {showWarning && (
                <div className="flex items-center gap-2 bg-yellow-900/80 border border-yellow-600 text-yellow-300 rounded-lg px-4 py-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span>
                        {skills.length === 0
                            ? "You haven't added any skills yet. Please add your skills to build your stack!"
                            : "You haven't updated your stack in over 60 days. Keep your skills up to date!"}
                    </span>
                </div>
            )}
            <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 rounded-lg px-4 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type a skill and press Enter..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                    maxLength={32}
                />
                <Button type="submit" disabled={loading || !inputValue.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {loading ? <span className="animate-spin">⏳</span> : <Plus className="w-4 h-4" />}
                </Button>
            </form>
            <div className="flex flex-wrap gap-2">
                {skills.length === 0 && (
                    <span className="text-gray-400 text-sm">No skills added yet. Start building your stack!</span>
                )}
                {skills.map((skill) => (
                    <Badge
                        key={skill}
                        className="flex items-center gap-2 bg-primary/20 text-primary font-semibold px-4 py-1.5 rounded-full border border-primary/40 transition hover:bg-primary/40 hover:border-primary hover:text-primary-foreground cursor-pointer shadow-none"
                    >
                        <Code className="w-4 h-4 text-primary" />
                        <span>{skill}</span>
                    </Badge>
                ))}
            </div>
        </div>
    )
}

export default BuildYourStack 