import { useState, useEffect } from "react"
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
import { CreateRecruiterContact, RecruiterContact } from "@/types/recruiters"
import { useToast } from "@/hooks/use-toast"

interface AddRecruiterModalProps {
    isOpen: boolean
    onClose: () => void
    onContactAdded: () => void
    editContact?: RecruiterContact
}

const AddRecruiterModal = ({
    isOpen,
    onClose,
    onContactAdded,
    editContact
}: AddRecruiterModalProps) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CreateRecruiterContact>({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "Screening in Process",
        follow_up_date: "",
        last_interview_date: "",
        link: "",
        comments: ""
    })

    console.log("HERE", formData.status)

    useEffect(() => {
        if (editContact) {
            setFormData({
                name: editContact.name || "",
                company: editContact.company || "",
                email: editContact.email || "",
                phone: editContact.phone || "",
                status: editContact.status || "Screening in Process",
                follow_up_date: editContact.follow_up_date,
                last_interview_date: editContact.last_interview_date,
                link: editContact.link || "",
                comments: editContact.comments || ""
            })
        } else {
            // Reset form when opening for new contact
            setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                status: "Screening in Process",
                follow_up_date: "",
                last_interview_date: "",
                link: "",
                comments: ""
            })
        }
    }, [editContact, isOpen])

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
                    description: "You must be logged in to manage contacts",
                    variant: "destructive"
                })
                return
            }

            // formData validation
            if (!formData.follow_up_date) formData.follow_up_date = null
            if (!formData.last_interview_date)
                formData.last_interview_date = null

            if (editContact) {
                // Update existing contact
                const { error } = await supabase
                    .from("recruiters")
                    .update({
                        ...formData,
                        user_id: user.id
                    })
                    .eq("id", editContact.id)

                if (error) throw error

                toast({
                    title: "Success",
                    description: "Recruiter contact updated successfully!"
                })
            } else {
                // Create new contact
                const { error } = await supabase.from("recruiters").insert([
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
            }

            onContactAdded()
            onClose()
        } catch (error) {
            console.error("Error managing contact:", error)
            toast({
                title: "Error",
                description: `Failed to ${
                    editContact ? "update" : "add"
                } recruiter contact`,
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
        console.log("HERE", 1, field, value)
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto glass-dark border-primary/20'>
                <DialogHeader>
                    <DialogTitle className='text-white'>
                        {editContact
                            ? "Edit Recruiter Contact"
                            : "Add New Recruiter Contact"}
                    </DialogTitle>
                    <DialogDescription className='text-gray-300'>
                        {editContact
                            ? "Update the recruiter's information and track your interactions."
                            : "Add a new recruiter to your network and keep track of your interactions."}
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[75vh] overflow-y-auto pr-1'>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex gap-2 flex-col'>
                                <Label htmlFor='name' className='text-white'>
                                    Name *
                                </Label>
                                <Input
                                    id='name'
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    required
                                    className='bg-gray-800 border-gray-600 text-white'
                                    placeholder='e.g. Sarah Johnson'
                                />
                            </div>
                            <div className='flex gap-2 flex-col'>
                                <Label htmlFor='email' className='text-white'>
                                    Email
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    className='bg-gray-800 border-gray-600 text-white'
                                    placeholder='e.g. sarah@google.com'
                                />
                            </div>
                            <div className='flex gap-2 flex-col'>
                                <Label htmlFor='phone' className='text-white'>
                                    Phone
                                </Label>
                                <Input
                                    id='phone'
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    className='bg-gray-800 border-gray-600 text-white'
                                    placeholder='e.g. +1 (555) 123-4567'
                                />
                            </div>
                            <div className='flex gap-2 flex-col'>
                                <Label htmlFor='company' className='text-white'>
                                    Company
                                </Label>
                                <Input
                                    id='company'
                                    value={formData.company}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "company",
                                            e.target.value
                                        )
                                    }
                                    className='bg-gray-800 border-gray-600 text-white'
                                    placeholder='e.g. Google'
                                />
                            </div>
                            <div className='flex gap-2 flex-col'>
                                <Label htmlFor='status' className='text-white'>
                                    Status
                                </Label>
                                <select
                                    className='w-full h-full bg-gray-800 border border-primary/20 text-white rounded-md px-2 py-1'
                                    value={formData.status || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "status",
                                            e.target.value
                                        )
                                    }>
                                    <option value='' disabled>
                                        Select status
                                    </option>
                                    <option value='Screening in Process'>
                                        Screening in Process
                                    </option>
                                    <option value='Interviewing'>
                                        Interviewing
                                    </option>
                                    <option value='Final Round Offer'>
                                        Final Round Offer
                                    </option>
                                    <option value='Offer Letter'>
                                        Offer Letter
                                    </option>
                                    <option value='Rejected'>Rejected</option>
                                </select>
                            </div>
                            <div className='flex gap-2 flex-col'>
                                <Label htmlFor='link' className='text-white'>
                                    Link
                                </Label>
                                <Input
                                    id='link'
                                    value={formData.link}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "link",
                                            e.target.value
                                        )
                                    }
                                    className='bg-gray-800 border-gray-600 text-white'
                                    placeholder='e.g. LinkedIn profile URL'
                                />
                            </div>
                            <div className='flex gap-2 flex-col'>
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
                            <div className='flex gap-2 flex-col'>
                                <Label
                                    htmlFor='last_interview_date'
                                    className='text-white'>
                                    Last Interview Date
                                </Label>
                                <Input
                                    id='last_interview_date'
                                    type='date'
                                    value={formData.last_interview_date}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "last_interview_date",
                                            e.target.value
                                        )
                                    }
                                    className='bg-gray-800 border-gray-600 text-white'
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor='comments' className='text-white'>
                                Comments
                            </Label>
                            <Textarea
                                id='comments'
                                value={formData.comments}
                                onChange={(e) =>
                                    handleInputChange(
                                        "comments",
                                        e.target.value
                                    )
                                }
                                className='bg-gray-800 border-gray-600 text-white resize-none'
                                placeholder='Add any additional comments about this contact...'
                                rows={3}
                            />
                        </div>
                        <DialogFooter className='flex flex-col-reverse md:flex-row gap-2'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={onClose}
                                className='border-gray-300 text-gray-900 hover:bg-gray-100'>
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                disabled={loading}
                                className='bg-primary text-primary-foreground'>
                                {loading ? "Managing..." : "Manage Contact"}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddRecruiterModal
