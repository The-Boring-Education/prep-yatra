import React, { useEffect, useState } from "react"
import { useAuth } from "../lib/auth.tsx" // Assuming useAuth is available for getting the user ID
import {
    getPrepLogs,
    addPrepLog,
    updatePrepLog,
    deletePrepLog
} from "../services/prep-logs"
import { PrepLog, CreatePrepLogDto, UpdatePrepLogDto } from "../types/prep-logs"
import { Button } from "../components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface AddEditPrepLogModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (log: CreatePrepLogDto) => void // Changed type to CreatePrepLogDto
    editingLog?: PrepLog | null
}

const AddEditPrepLogModal: React.FC<AddEditPrepLogModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingLog
}) => {
    const [logDate, setLogDate] = useState<Date | null>(
        editingLog ? new Date(editingLog.log_date) : new Date()
    )
    const [logs, setLogs] = useState<string[]>(
        editingLog ? editingLog.logs : [" "]
    )
    const [hoursInMinutes, setHoursInMinutes] = useState<number>(
        editingLog ? editingLog.hours_in_minutes : 0
    )
    const [errors, setErrors] = useState<{ logs?: string; hours?: string }>({})

    useEffect(() => {
        if (editingLog) {
            setLogDate(new Date(editingLog.log_date))
            setLogs(editingLog.logs)
            setHoursInMinutes(editingLog.hours_in_minutes)
        } else {
            setLogDate(new Date())
            setLogs([" "])
            setHoursInMinutes(0)
        }
        setErrors({}) // Clear errors on modal open/editLog change
    }, [editingLog, isOpen])

    const handleLogChange = (index: number, value: string) => {
        const newLogs = [...logs]
        newLogs[index] = value
        setLogs(newLogs)
    }

    const handleAddLogPoint = () => {
        setLogs([...logs, " "])
    }

    const handleRemoveLogPoint = (index: number) => {
        const newLogs = logs.filter((_, i) => i !== index)
        setLogs(newLogs)
    }

    const validate = () => {
        const newErrors: { logs?: string; hours?: string } = {}
        if (logs.every((log) => log.trim() === "")) {
            newErrors.logs = "At least one log point is required."
        }
        if (hoursInMinutes <= 0) {
            newErrors.hours = "Hours must be a positive number."
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (!validate()) {
            return
        }
        const logData: CreatePrepLogDto = {
            log_date: logDate?.toISOString().split("T")[0] || "", // Format as YYYY-MM-DD, added fallback for safety
            logs: logs.filter((log) => log.trim() !== ""), // Filter out empty logs
            hours_in_minutes: hoursInMinutes
        }
        onSave(logData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>
                        {editingLog ? "Edit" : "Add"} Prep Log
                    </DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='logDate' className='text-right'>
                            Date
                        </Label>
                        <DatePicker
                            id='logDate'
                            selected={logDate}
                            onChange={(date: Date | null) => setLogDate(date)}
                            className='col-span-3'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='hours' className='text-right'>
                            Hours (in minutes)
                        </Label>
                        <Input
                            id='hours'
                            type='number'
                            value={hoursInMinutes}
                            onChange={(e) =>
                                setHoursInMinutes(parseInt(e.target.value) || 0)
                            }
                            className='col-span-3'
                        />
                        {errors.hours && (
                            <span className='col-span-4 text-right text-red-500 text-sm'>
                                {errors.hours}
                            </span>
                        )}
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='logs' className='text-right'>
                            Log Points
                        </Label>
                        <div className='col-span-3'>
                            {logs.map((log, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-2 mb-2'>
                                    <Textarea
                                        value={log}
                                        onChange={(e) =>
                                            handleLogChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Log point ${index + 1}`}
                                        rows={1}
                                        className='flex-grow'
                                    />
                                    {logs.length > 1 && (
                                        <Button
                                            variant='destructive'
                                            size='sm'
                                            onClick={() =>
                                                handleRemoveLogPoint(index)
                                            }>
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleAddLogPoint}>
                                Add Another Point
                            </Button>
                        </div>
                        {errors.logs && (
                            <span className='col-span-4 text-right text-red-500 text-sm'>
                                {errors.logs}
                            </span>
                        )}
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button onClick={handleSave}>Save Log</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const PrepLogs: React.FC = () => {
    const { user } = useAuth() // Get user from auth context
    const [prepLogs, setPrepLogs] = useState<PrepLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingLog, setEditingLog] = useState<PrepLog | null>(null)

    const fetchPrepLogs = async () => {
        if (user) {
            setIsLoading(true)
            const logs = await getPrepLogs(user.id)
            if (logs) {
                setPrepLogs(logs)
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPrepLogs()
    }, [user]) // Refetch when user changes

    const handleSaveLog = async (logData: CreatePrepLogDto) => {
        if (!user) return

        if (editingLog) {
            // Note: UpdatePrepLogDto might be more appropriate here if we were only sending partial updates,
            // but since the modal returns all fields, CreatePrepLogDto works for now.
            // If backend expects partial updates, we'd need to map logData to UpdatePrepLogDto
            // and potentially handle cases where fields are undefined.
            const updateData: UpdatePrepLogDto = {
                log_date: logData.log_date,
                logs: logData.logs,
                hours_in_minutes: logData.hours_in_minutes
            }
            await updatePrepLog(editingLog.id, updateData)
        } else {
            await addPrepLog(user.id, logData)
        }
        fetchPrepLogs() // Refresh logs after save
        setIsModalOpen(false)
        setEditingLog(null)
    }

    const handleEditClick = (log: PrepLog) => {
        setEditingLog(log)
        setIsModalOpen(true)
    }

    const handleDeleteClick = async (id: string) => {
        if (confirm("Are you sure you want to delete this log?")) {
            await deletePrepLog(id)
            fetchPrepLogs() // Refresh logs after delete
        }
    }

    if (isLoading) {
        return <div>Loading Prep Logs...</div>
    }

    return (
        <div className='container mx-auto py-8'>
            <h1 className='text-2xl font-bold mb-4'>Prep Logs</h1>
            <div className='flex justify-end mb-4'>
                <Button onClick={() => setIsModalOpen(true)}>
                    Add Prep Log
                </Button>
            </div>

            <AddEditPrepLogModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingLog(null)
                }}
                onSave={handleSaveLog}
                editingLog={editingLog}
            />

            {prepLogs.length === 0 ? (
                <p>No prep logs yet. Add your first log!</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Hours (min)</TableHead>
                            <TableHead>Log Points</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {prepLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    {new Date(
                                        log.log_date
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{log.hours_in_minutes}</TableCell>
                                <TableCell>
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
                                        onClick={() => handleEditClick(log)}
                                        className='mr-2'>
                                        Edit
                                    </Button>
                                    <Button
                                        variant='destructive'
                                        size='sm'
                                        onClick={() =>
                                            handleDeleteClick(log.id)
                                        }>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default PrepLogs
