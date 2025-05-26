import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { recruitmentService } from "@/services/recruitment"
import { Recruitment, InterviewStatus } from "@/types/recruitment"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"

const statusColors: Record<InterviewStatus, string> = {
    Screening: "bg-yellow-100 text-yellow-800",
    Interviewing: "bg-blue-100 text-blue-800",
    "Last Round Pending": "bg-purple-100 text-purple-800",
    "Offer Letter": "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800"
}

export default function RecruitmentPage() {
    const [selectedStatus, setSelectedStatus] = useState<
        InterviewStatus | "all"
    >("all")
    const queryClient = useQueryClient()

    const { data: recruitments = [], isLoading } = useQuery({
        queryKey: ["recruitments", selectedStatus],
        queryFn: () =>
            selectedStatus === "all"
                ? recruitmentService.getAll()
                : recruitmentService.getByStatus(selectedStatus)
    })

    const createMutation = useMutation({
        mutationFn: recruitmentService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recruitments"] })
            toast.success("Candidate added successfully")
        }
    })

    const updateMutation = useMutation({
        mutationFn: recruitmentService.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recruitments"] })
            toast.success("Status updated successfully")
        }
    })

    const handleStatusChange = async (id: string, status: InterviewStatus) => {
        await updateMutation.mutateAsync({ id, interview_status: status })
    }

    return (
        <div className='container py-10'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-bold'>Recruitment Dashboard</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Candidate</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Candidate</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                await createMutation.mutateAsync({
                                    name: formData.get("name") as string,
                                    company: formData.get("company") as string,
                                    email: formData.get("email") as string,
                                    phone: formData.get("phone") as string,
                                    interview_status: "Screening",
                                    follow_up_date: formData.get(
                                        "follow_up_date"
                                    ) as string,
                                    interview_date: formData.get(
                                        "interview_date"
                                    ) as string,
                                    notes: formData.get("notes") as string
                                })
                            }}
                            className='space-y-4'>
                            <div>
                                <Label htmlFor='name'>Name</Label>
                                <Input id='name' name='name' required />
                            </div>
                            <div>
                                <Label htmlFor='company'>Company</Label>
                                <Input id='company' name='company' />
                            </div>
                            <div>
                                <Label htmlFor='email'>Email</Label>
                                <Input id='email' name='email' type='email' />
                            </div>
                            <div>
                                <Label htmlFor='phone'>Phone</Label>
                                <Input id='phone' name='phone' />
                            </div>
                            <div>
                                <Label htmlFor='follow_up_date'>
                                    Follow Up Date
                                </Label>
                                <Input
                                    id='follow_up_date'
                                    name='follow_up_date'
                                    type='date'
                                />
                            </div>
                            <div>
                                <Label htmlFor='interview_date'>
                                    Interview Date
                                </Label>
                                <Input
                                    id='interview_date'
                                    name='interview_date'
                                    type='date'
                                />
                            </div>
                            <div>
                                <Label htmlFor='notes'>Notes</Label>
                                <Textarea id='notes' name='notes' />
                            </div>
                            <Button type='submit' className='w-full'>
                                Add Candidate
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='mb-4'>
                <Select
                    value={selectedStatus}
                    onValueChange={(value) =>
                        setSelectedStatus(value as InterviewStatus | "all")
                    }>
                    <SelectTrigger className='w-[200px]'>
                        <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='Screening'>Screening</SelectItem>
                        <SelectItem value='Interviewing'>
                            Interviewing
                        </SelectItem>
                        <SelectItem value='Last Round Pending'>
                            Last Round Pending
                        </SelectItem>
                        <SelectItem value='Offer Letter'>
                            Offer Letter
                        </SelectItem>
                        <SelectItem value='Rejected'>Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className='text-center'>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            recruitments.map((recruitment) => (
                                <TableRow key={recruitment.id}>
                                    <TableCell>{recruitment.name}</TableCell>
                                    <TableCell>
                                        {recruitment.company || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {recruitment.email && (
                                            <div className='text-sm'>
                                                {recruitment.email}
                                            </div>
                                        )}
                                        {recruitment.phone && (
                                            <div className='text-sm text-muted-foreground'>
                                                {recruitment.phone}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={recruitment.interview_status}
                                            onValueChange={(value) =>
                                                handleStatusChange(
                                                    recruitment.id,
                                                    value as InterviewStatus
                                                )
                                            }>
                                            <SelectTrigger
                                                className={`w-[180px] ${
                                                    statusColors[
                                                        recruitment
                                                            .interview_status
                                                    ]
                                                }`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='Screening'>
                                                    Screening
                                                </SelectItem>
                                                <SelectItem value='Interviewing'>
                                                    Interviewing
                                                </SelectItem>
                                                <SelectItem value='Last Round Pending'>
                                                    Last Round Pending
                                                </SelectItem>
                                                <SelectItem value='Offer Letter'>
                                                    Offer Letter
                                                </SelectItem>
                                                <SelectItem value='Rejected'>
                                                    Rejected
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {recruitment.follow_up_date && (
                                            <div className='text-sm'>
                                                Follow up:{" "}
                                                {format(
                                                    new Date(
                                                        recruitment.follow_up_date
                                                    ),
                                                    "MMM d, yyyy"
                                                )}
                                            </div>
                                        )}
                                        {recruitment.interview_date && (
                                            <div className='text-sm text-muted-foreground'>
                                                Interview:{" "}
                                                {format(
                                                    new Date(
                                                        recruitment.interview_date
                                                    ),
                                                    "MMM d, yyyy"
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className='max-w-[200px] truncate'>
                                            {recruitment.notes || "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => {
                                                // TODO: Implement view details
                                            }}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
