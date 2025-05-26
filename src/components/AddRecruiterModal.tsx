import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { CreateRecruiterContact } from "@/types/recruiters"
import { useToast } from "@/hooks/use-toast"

interface AddRecruiterModalProps {
    isOpen: boolean
    onClose: () => void
    onContactAdded: () => void
}

const AddRecruiterModal = ({
    isOpen,
    onClose,
    onContactAdded
}: AddRecruiterModalProps) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CreateRecruiterContact>({
        name: "",
        company: "",
        email: "",
        phone: "",
        position: "",
        status: "Screening",
        follow_up_date: "",
        interview_date: "",
        notes: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const {
                data: { user }
            } = await supabase.auth.getUser()
            if (!user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to add contacts",
                    variant: "destructive"
                })
                return
            }

            const { error } = await supabase.from("recruitment").insert([
                {
                    ...formData,
                    user_id: user.id
                }
            ])

            if (error) throw error

            toast({
                title: "Success",
                description: "Recruiter contact added successfully!"
            })

            // Reset form
            setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                position: "",
                notes: "",
                status: "Screening"
            })

            onContactAdded()
            onClose()
        } catch (error) {
            console.error("Error adding contact:", error)
            toast({
                title: "Error",
                description: "Failed to add recruiter contact",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (
        field: keyof CreateRecruiterContact,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[600px] glass-dark border-primary/20'>
                <DialogHeader>
                    <DialogTitle className='text-white'>
                        Add New Recruiter Contact
                    </DialogTitle>
                    <DialogDescription className='text-gray-300'>
                        Add a new recruiter to your network and keep track of
                        your interactions.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label htmlFor='name' className='text-white'>
                                Full Name *
                            </Label>
                            <Input
                                id='name'
                                value={formData.name}
                                onChange={(e) =>
                                    handleInputChange("name", e.target.value)
                                }
                                required
                                className='bg-gray-800 border-gray-600 text-white'
                                placeholder='e.g. Sarah Johnson'
                            />
                        </div>
                        <div>
                            <Label htmlFor='company' className='text-white'>
                                Company *
                            </Label>
                            <Input
                                id='company'
                                value={formData.company}
                                onChange={(e) =>
                                    handleInputChange("company", e.target.value)
                                }
                                required
                                className='bg-gray-800 border-gray-600 text-white'
                                placeholder='e.g. Google'
                            />
                        </div>
                        <div>
                            <Label htmlFor='position' className='text-white'>
                                Position *
                            </Label>
                            <Input
                                id='position'
                                value={formData.position}
                                onChange={(e) =>
                                    handleInputChange(
                                        "position",
                                        e.target.value
                                    )
                                }
                                required
                                className='bg-gray-800 border-gray-600 text-white'
                                placeholder='e.g. Senior Recruiter'
                            />
                        </div>
                        <div>
                            <Label htmlFor='email' className='text-white'>
                                Email *
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                value={formData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                required
                                className='bg-gray-800 border-gray-600 text-white'
                                placeholder='e.g. sarah@google.com'
                            />
                        </div>
                        <div>
                            <Label htmlFor='phone' className='text-white'>
                                Phone
                            </Label>
                            <Input
                                id='phone'
                                value={formData.phone}
                                onChange={(e) =>
                                    handleInputChange("phone", e.target.value)
                                }
                                className='bg-gray-800 border-gray-600 text-white'
                                placeholder='e.g. +1 (555) 123-4567'
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor='follow_up_date'
                                className='text-white'>
                                Follow-up Date
                            </Label>
                            <Input
                                id='follow_up_date'
                                type='date'
                                value={formData.follow_up_date}
                                onChange={(e) =>
                                    handleInputChange(
                                        "follow_up_date",
                                        e.target.value
                                    )
                                }
                                className='bg-gray-800 border-gray-600 text-white'
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor='interview_date'
                                className='text-white'>
                                Interview Date
                            </Label>
                            <Input
                                id='interview_date'
                                type='date'
                                value={formData.interview_date}
                                onChange={(e) =>
                                    handleInputChange(
                                        "interview_date",
                                        e.target.value
                                    )
                                }
                                className='bg-gray-800 border-gray-600 text-white'
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor='notes' className='text-white'>
                            Notes
                        </Label>
                        <Textarea
                            id='notes'
                            value={formData.notes}
                            onChange={(e) =>
                                handleInputChange("notes", e.target.value)
                            }
                            className='bg-gray-800 border-gray-600 text-white resize-none'
                            placeholder='Add any additional notes about this contact...'
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={onClose}
                            className='border-gray-600 text-gray-300'>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={loading}
                            className='bg-primary text-primary-foreground'>
                            {loading ? "Adding..." : "Add Contact"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddRecruiterModal
