import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
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
import { addPrepLog } from "../services/prep-logs"
import { CreatePrepLogDto } from "../types/prep-logs"
import { useToast } from "../hooks/use-toast"

interface AddPrepLogModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string // Need user ID to associate the log
    onLogAdded: () => void // Callback to refresh logs on the dashboard
}

const AddPrepLogModal: React.FC<AddPrepLogModalProps> = ({
    isOpen,
    onClose,
    userId,
    onLogAdded
}) => {
    const { toast } = useToast()
    const [logDate, setLogDate] = useState<Date | null>(new Date())
    const [logs, setLogs] = useState<string[]>([""]) // Array of log points
    const [hoursInMinutes, setHoursInMinutes] = useState<number>(0)
    const [errors, setErrors] = useState<{ logs?: string; hours?: string }>({})
    const [isSaving, setIsSaving] = useState(false)

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setLogDate(new Date())
            setLogs([""])
            setHoursInMinutes(0)
            setErrors({})
            setIsSaving(false)
        }
    }, [isOpen])

    const handleLogChange = (index: number, value: string) => {
        const newLogs = [...logs]
        newLogs[index] = value
        setLogs(newLogs)
    }

    const handleAddLogPoint = () => {
        setLogs([...logs, ""])
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

    const handleSave = async () => {
        if (!validate() || isSaving) {
            return
        }

        setIsSaving(true)

        const logData: CreatePrepLogDto = {
            log_date: logDate?.toISOString().split("T")[0] || "", // Format as YYYY-MM-DD
            logs: logs.filter((log) => log.trim() !== ""), // Filter out empty logs
            hours_in_minutes: hoursInMinutes
        }

        const newLog = await addPrepLog(userId, logData)

        if (newLog) {
            toast({
                title: "Success",
                description: "Prep log added successfully."
            })
            onLogAdded() // Notify parent to refresh
            onClose() // Close modal
        } else {
            toast({
                title: "Error",
                description: "Failed to add prep log.",
                variant: "destructive"
            })
        }
        setIsSaving(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Add Prep Log</DialogTitle>
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
                            className='col-span-3 w-full border rounded-md p-2'
                            dateFormat='yyyy-MM-dd'
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
                            min='1'
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
                        <div className='col-span-3 w-full'>
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
                                type='button'
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
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Log"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddPrepLogModal
