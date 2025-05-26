import { useState, useEffect } from "react"
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
import { Mail, Phone, Linkedin, ExternalLink, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { RecruiterContact } from "@/types/recruiters"
import { useToast } from "@/hooks/use-toast"
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

interface RecruiterContactsTableProps {
    contacts: RecruiterContact[]
    onContactsChange: () => void
}

const RecruiterContactsTable = ({
    contacts,
    onContactsChange
}: RecruiterContactsTableProps) => {
    const { toast } = useToast()

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "follow_up":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            case "interview_scheduled":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "closed":
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const formatStatus = (status: string) => {
        return status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const handleDelete = async (contactId: string) => {
        try {
            const { error } = await supabase
                .from("recruitment")
                .delete()
                .eq("id", contactId)

            if (error) throw error

            toast({
                title: "Success",
                description: "Contact deleted successfully"
            })

            onContactsChange()
        } catch (error) {
            console.error("Error deleting contact:", error)
            toast({
                title: "Error",
                description: "Failed to delete contact",
                variant: "destructive"
            })
        }
    }

    const openEmail = (email: string) => {
        window.open(`mailto:${email}`, "_blank")
    }

    const openPhone = (phone: string) => {
        window.open(`tel:${phone}`, "_blank")
    }

    const openLinkedIn = (url: string) => {
        window.open(url, "_blank")
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
        <div className='glass-dark rounded-2xl p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-bold text-white'>
                    Your Recruiter Network
                </h3>
                <Badge
                    variant='secondary'
                    className='bg-primary/20 text-primary'>
                    {contacts.length} Contact{contacts.length !== 1 ? "s" : ""}
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
                                Company
                            </TableHead>
                            <TableHead className='text-primary font-semibold'>
                                Position
                            </TableHead>
                            <TableHead className='text-primary font-semibold'>
                                Contact
                            </TableHead>
                            <TableHead className='text-primary font-semibold'>
                                Status
                            </TableHead>
                            <TableHead className='text-primary font-semibold'>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow
                                key={contact.id}
                                className='border-primary/10 hover:bg-primary/5 transition-colors'>
                                <TableCell className='text-white font-medium'>
                                    {contact.name}
                                </TableCell>
                                <TableCell className='text-gray-300'>
                                    {contact.company}
                                </TableCell>
                                <TableCell className='text-gray-300'>
                                    {contact.phone}
                                </TableCell>
                                <TableCell className='text-gray-300'>
                                    <div className='flex flex-col gap-1'>
                                        <div className='text-sm'>
                                            {contact.email}
                                        </div>
                                        {contact.phone && (
                                            <div className='text-sm text-gray-400'>
                                                {contact.phone}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={getStatusColor(
                                            contact.status
                                        )}>
                                        {formatStatus(contact.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-2'>
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
                                        {contact.phone && (
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                onClick={() =>
                                                    openPhone(contact.phone!)
                                                }
                                                className='h-8 w-8 p-0 hover:bg-primary/20'
                                                title='Call'>
                                                <Phone className='h-4 w-4 text-primary' />
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    className='h-8 w-8 p-0 hover:bg-red-500/20'
                                                    title='Delete Contact'>
                                                    <Trash2 className='h-4 w-4 text-red-400' />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className='glass-dark border-primary/20'>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className='text-white'>
                                                        Delete Contact
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className='text-gray-300'>
                                                        Are you sure you want to
                                                        delete {contact.name}?
                                                        This action cannot be
                                                        undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className='border-gray-600 text-gray-300'>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                contact.id
                                                            )
                                                        }
                                                        className='bg-red-500 hover:bg-red-600'>
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
    )
}

export default RecruiterContactsTable
