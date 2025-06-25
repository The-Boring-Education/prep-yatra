import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AddPrepLogModal from "./AddPrepLogModal"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

type PrepLog = {
    _id: string
    title: string
    description?: string
    timeSpent: number
    createdAt: string
}

interface Props {
    logs: PrepLog[]
    onLogUpdated: () => void
    mongoUserId: string
}

const PrepLogCard = ({ logs, onLogUpdated, mongoUserId }: Props) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedLog, setSelectedLog] = useState<PrepLog | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const openEditModal = (log: PrepLog) => {
        setSelectedLog(log)
        setIsEditModalOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)

        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/api/v1/prep-yatra/prep-log?prepLogId=${deleteId}`,
                {
                    method: "DELETE"
                }
            )
            const result = await res.json()

            if (!result.status) throw new Error(result.message)

            toast({
                title: "Log deleted",
                description: "Your prep log was successfully deleted.",
                variant: "default"
            })
            onLogUpdated()
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete log",
                variant: "destructive"
            })
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    if (logs.length === 0) {
        return (
            <div className='mt-8'>
                <h2 className='text-2xl font-bold text-white mb-4'>
                    📚 Your Prep Logs
                </h2>
                <div className='glass-dark rounded-2xl p-8 text-center'>
                    <h3 className='text-xl font-bold text-white mb-2'>
                        No PrepLogs Yet
                    </h3>
                    <p className='text-gray-300'>
                        Start building your recruiter network by adding your
                        first contact!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='mt-8'>
                <h2 className='text-2xl font-bold text-white mb-4'>
                    📚 Your Prep Logs
                </h2>

                <div className='grid gap-4 md:grid-cols-2'>
                    {logs.map((log) => (
                        <Card
                            key={log._id}
                            className='glass-dark border border-primary/20 hover:border-primary/40 transition-all'>
                            <CardHeader>
                                <CardTitle className='text-white text-lg'>
                                    {log.title}
                                </CardTitle>
                                <p className='text-sm text-gray-400'>
                                    {new Date(
                                        log.createdAt
                                    ).toLocaleDateString()}{" "}
                                    • ⏱ {log.timeSpent} hr
                                </p>
                            </CardHeader>
                            <CardContent>
                                <p className='text-gray-300 mb-4'>
                                    {log.description || "No description"}
                                </p>
                                <div className='flex gap-2'>
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        className=''
                                        onClick={() => openEditModal(log)}>
                                        ✏️ Edit
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size='sm'
                                                variant='outline'
                                                className=''
                                                onClick={() =>
                                                    setDeleteId(log._id)
                                                }>
                                                ❌ Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className='bg-gray-800 border-primary/20'>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className='text-white'>
                                                    Delete Prep Log
                                                </AlertDialogTitle>
                                                <AlertDialogDescription className='text-gray-300'>
                                                    Are you sure you want to
                                                    delete this prep log? This
                                                    action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className='bg-muted border-primary/20 bg-gray-800 text-white '>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className='bg-red-600 text-white hover:bg-red-700'
                                                    onClick={handleDelete}
                                                    disabled={isDeleting}>
                                                    {isDeleting
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <AddPrepLogModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onLogAdded={onLogUpdated}
                mongoUserId={mongoUserId}
                editLog={selectedLog}
            />
        </>
    )
}

export default PrepLogCard
