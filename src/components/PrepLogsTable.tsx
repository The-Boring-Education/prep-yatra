import React, { useState } from "react"
import { Button } from "../components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../components/ui/table"
import { PrepLog } from "../types/prep-logs"
import { deletePrepLog } from "../services/prep-logs"
import { useToast } from "../hooks/use-toast"
import PrepLogModal from "./AddPrepLogModal"

interface PrepLogsTableProps {
    logs: PrepLog[]
    userId: string // Needed for adding new logs from the table component
    onLogAddedOrUpdated: () => void // Callback to refresh logs in parent
    onLogDeleted: () => void // Callback to refresh logs in parent after delete
}

const PrepLogsTable: React.FC<PrepLogsTableProps> = ({
    logs,
    userId,
    onLogAddedOrUpdated,
    onLogDeleted
}) => {
    const { toast } = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingLog, setEditingLog] = useState<PrepLog | null>(null)

    const handleDelete = async (logId: string) => {
        if (confirm("Are you sure you want to delete this prep log?")) {
            const success = await deletePrepLog(logId)
            if (success) {
                toast({
                    title: "Success",
                    description: "Prep log deleted successfully."
                })
                onLogDeleted() // Refresh logs after deletion
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete prep log.",
                    variant: "destructive"
                })
            }
        }
    }

    const handleEdit = (log: PrepLog) => {
        setEditingLog(log)
        setIsModalOpen(true)
    }

    const handleAddLogClick = () => {
        setEditingLog(null) // Ensure no log is being edited when adding
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setEditingLog(null) // Clear editing log on close
    }

    const handleLogSaved = () => {
        onLogAddedOrUpdated() // Refresh logs after add or update
        handleModalClose() // Close modal
    }

    if (logs.length === 0) {
        return (
            <div className='glass-dark rounded-2xl p-8 text-center'>
                <div className='text-6xl mb-4'>📚</div>
                <h3 className='text-xl font-bold text-white mb-2'>
                    No Prep Logs Yet
                </h3>
                <p className='text-gray-300'>
                    Start tracking your preparation by adding your first log!
                </p>
                <Button
                    onClick={handleAddLogClick}
                    className='mt-4 bg-primary text-primary-foreground hover:bg-primary/90'>
                    Add First Prep Log
                </Button>
            </div>
        )
    }

    return (
        <div className='glass-dark rounded-2xl p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-xl font-bold text-white'>Your Prep Logs</h3>
                <Button
                    onClick={handleAddLogClick}
                    className='bg-primary text-primary-foreground hover:bg-primary/90'>
                    Add Prep Log
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className='border-primary/20 hover:bg-transparent'>
                        <TableHead className='text-primary font-semibold'>
                            Date
                        </TableHead>
                        <TableHead className='text-primary font-semibold'>
                            Hours (min)
                        </TableHead>
                        <TableHead className='text-primary font-semibold'>
                            Log Points
                        </TableHead>
                        <TableHead className='text-primary font-semibold'>
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow
                            key={log.id}
                            className='border-primary/10 hover:bg-primary/5 transition-colors'>
                            <TableCell className='text-white font-medium'>
                                {new Date(log.log_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className='text-gray-300'>
                                {log.hours_in_minutes}
                            </TableCell>
                            <TableCell className='text-gray-300'>
                                <ul>
                                    {log.logs.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => handleEdit(log)}
                                    className='mr-2'>
                                    Edit
                                </Button>
                                <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={() => handleDelete(log.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Prep Log Modal for Adding/Editing */}
            <PrepLogModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                userId={userId}
                onLogSaved={handleLogSaved}
                editingLog={editingLog}
            />
        </div>
    )
}

export default PrepLogsTable
