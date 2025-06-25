import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Mail,
    Phone,
    ExternalLink,
    Trash2,
    Edit2,
    Calendar
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { RecruiterContact } from "@/types/recruiters"
import { useToast } from "@/hooks/use-toast"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import AddRecruiterModal from "./AddRecruiterModal"

interface RecruiterContactsTableProps {
    contacts: RecruiterContact[]
    onContactsChange: () => void
    mongoUserId?: string
}

const RecruiterContactsTable = ({
    contacts,
    onContactsChange,
    mongoUserId
}: RecruiterContactsTableProps) => {
    const { toast } = useToast()
    const [editingContact, setEditingContact] =
        useState<RecruiterContact | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "Screening in Process":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "Interviewing":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            case "Final Round Offer":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            case "Offer Letter":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "Rejected":
                return "bg-red-500/20 text-red-400 border-red-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const handleDelete = async (recruiterId: string) => {
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/api/v1/prep-yatra/recruiter?recruiterId=${recruiterId}`,
                {
                    method: "DELETE"
                }
            )

            console.log(recruiterId)

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            toast({
                title: "Deleted",
                description: "Recruiter deleted successfully"
            })

            onContactsChange()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete recruiter",
                variant: "destructive"
            })
        }
    }

    const handleStatusChange = async (
        recruiterId: string,
        newStatus: string
    ) => {
        try {
            console.log("this rec id is being sent", recruiterId)
            const res = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/api/v1/prep-yatra/recruiter`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recruiterId,
                        applicationStatus: newStatus
                    })
                }
            )

            console.log(recruiterId)

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            toast({
                title: "Success",
                description: "Status updated successfully"
            })

            onContactsChange()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive"
            })
        }
    }

    const handleDateChange = async (
        recruiterId: string,
        field: "follow_up_date" | "last_interview_date",
        newDate: Date | null
    ) => {
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/api/v1/prep-yatra/recruiter`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recruiterId,
                        [field]: newDate?.toISOString() || null
                    })
                }
            )

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            toast({
                title: "Success",
                description: "Date updated successfully"
            })

            onContactsChange()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update date",
                variant: "destructive"
            })
        }
    }

    const handleEdit = (contact: RecruiterContact) => {
        setEditingContact(contact)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setEditingContact(null)
        setIsModalOpen(false)
    }

    const openEmail = (email?: string) => {
        if (email) {
            window.open(`mailto:${email}`, "_blank")
        }
    }

    const openPhone = (phone?: string) => {
        if (phone) {
            window.open(`tel:${phone}`, "_blank")
        }
    }

    const openLink = (link?: string) => {
        if (link) {
            window.open(link, "_blank")
        }
    }

    if (contacts.length === 0) {
        return (
            <div className='glass-dark rounded-2xl p-8 text-center'>
                <div className='text-6xl mb-4'>📞</div>
                <h3 className='text-xl font-bold text-white mb-2'>
                    No Contacts Yet
                </h3>
                <p className='text-gray-300'>
                    Start building your recruiter network by adding your first
                    contact!
                </p>
            </div>
        )
    }

    return (
        <>
            <div className='glass-dark rounded-2xl p-6'>
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-xl font-bold text-white'>
                        Your Recruiter Network
                    </h3>
                    <Badge
                        variant='secondary'
                        className='bg-primary/20 text-primary'>
                        {contacts.length} Contact
                        {contacts.length !== 1 ? "s" : ""}
                    </Badge>
                </div>

                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow className='border-primary/20 hover:bg-transparent'>
                                <TableHead className='text-primary font-semibold'>
                                    Name
                                </TableHead>
                                <TableHead className='text-primary font-semibold'>
                                    Contact
                                </TableHead>
                                <TableHead className='text-primary font-semibold'>
                                    Status
                                </TableHead>
                                <TableHead className='text-primary font-semibold'>
                                    Follow Up
                                </TableHead>
                                <TableHead className='text-primary font-semibold'>
                                    Last Interview
                                </TableHead>
                                <TableHead className='text-primary font-semibold'>
                                    Comapany
                                </TableHead>
                                <TableHead className='text-primary font-semibold'>
                                    Comments
                                </TableHead>
                                <TableHead className='text-primary font-semibold'>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.map((contact) => (
                                <TableRow
                                    key={contact._id}
                                    className='border-primary/10 hover:bg-primary/5 transition-colors'>
                                    <TableCell className='text-white font-medium'>
                                        {contact.recruiterName}
                                    </TableCell>
                                    <TableCell className='text-gray-300'>
                                        <div className='flex flex-col gap-1'>
                                            {contact.email && (
                                                <div className='text-sm'>
                                                    {contact.email}
                                                </div>
                                            )}
                                            {contact.phone && (
                                                <div className='text-sm text-gray-400'>
                                                    {contact.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            className='w-[180px] bg-gray-800 border border-primary/20 text-white rounded-md px-2 py-1'
                                            value={
                                                contact.applicationStatus || ""
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    contact._id,
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
                                            <option value='Rejected'>
                                                Rejected
                                            </option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <DatePicker
                                            selected={
                                                contact.follow_up_date
                                                    ? new Date(
                                                          contact.follow_up_date
                                                      )
                                                    : null
                                            }
                                            onChange={(date: Date | null) =>
                                                handleDateChange(
                                                    contact._id,
                                                    "follow_up_date",
                                                    date
                                                )
                                            }
                                            className='bg-transparent border border-primary/20 rounded-md px-2 py-1 text-white w-[150px]'
                                            dateFormat='MMM d, yyyy'
                                            placeholderText='Select date'
                                            isClearable
                                            portalId='recruiter-datepicker-portal'
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <DatePicker
                                            selected={
                                                contact.last_interview_date
                                                    ? new Date(
                                                          contact.last_interview_date
                                                      )
                                                    : null
                                            }
                                            onChange={(date: Date | null) =>
                                                handleDateChange(
                                                    contact._id,
                                                    "last_interview_date",
                                                    date
                                                )
                                            }
                                            className='bg-transparent border border-primary/20 rounded-md px-2 py-1 text-white w-[150px]'
                                            dateFormat='MMM d, yyyy'
                                            placeholderText='Select date'
                                            isClearable
                                            portalId='recruiter-datepicker-portal'
                                        />
                                    </TableCell>
                                    <TableCell className='text-gray-300 max-w-xs'>
                                        <div className='line-clamp-2 whitespace-pre-line break-words'>
                                            {contact.company || "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-gray-300 max-w-xs'>
                                        <div className='line-clamp-2 whitespace-pre-line break-words'>
                                            {contact.comments || "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            {contact.email && (
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    onClick={() =>
                                                        openEmail(contact.email)
                                                    }
                                                    className='h-8 w-8 p-0 hover:bg-primary/20'
                                                    title='Send Email'>
                                                    <Mail className='h-4 w-4 text-primary' />
                                                </Button>
                                            )}
                                            {contact.phone && (
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    onClick={() =>
                                                        openPhone(contact.phone)
                                                    }
                                                    className='h-8 w-8 p-0 hover:bg-primary/20'
                                                    title='Call'>
                                                    <Phone className='h-4 w-4 text-primary' />
                                                </Button>
                                            )}
                                            {contact.link && (
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    onClick={() =>
                                                        openLink(contact.link)
                                                    }
                                                    className='h-8 w-8 p-0 hover:bg-primary/20'
                                                    title='Open Link'>
                                                    <ExternalLink className='h-4 w-4 text-primary' />
                                                </Button>
                                            )}
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                onClick={() =>
                                                    handleEdit(contact)
                                                }
                                                className='h-8 w-8 p-0 hover:bg-primary/20'
                                                title='Edit Contact'>
                                                <Edit2 className='h-4 w-4 text-primary' />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size='sm'
                                                        variant='ghost'
                                                        className='h-8 w-8 p-0 hover:bg-red-500/20'
                                                        title='Delete Contact'>
                                                        <Trash2 className='h-4 w-4 text-red-500' />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className='bg-gray-800 border-primary/20'>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className='text-white'>
                                                            Delete Contact
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className='text-gray-300'>
                                                            Are you sure you
                                                            want to delete this
                                                            contact? This action
                                                            cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className='bg-gray-800 text-white border-gray-600'>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    contact._id
                                                                )
                                                            }
                                                            className='bg-red-500 text-white hover:bg-red-600'>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AddRecruiterModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onContactAdded={onContactsChange}
                editContact={editingContact}
                mongoUserId={mongoUserId}
            />
        </>
    )
}

export default RecruiterContactsTable
