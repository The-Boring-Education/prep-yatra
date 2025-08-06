import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Calendar, Clock, User, Target, TrendingUp } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

interface PrepLog {
    _id: string
    title: string
    description?: string
    timeSpent: number
    createdAt: string
}

interface UserProfile {
    name: string
    username: string
    createdAt: string
    prepYatra: {
        goal?: string
        experienceLevel?: string
    }
}

const PrepLogsShowcase = () => {
    const router = useRouter()
    const { userId } = router.query
    const [prepLogs, setPrepLogs] = useState<PrepLog[]>([])
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const formatTimeSpent = (hours: number) => {
        if (hours < 1) return `${Math.round(hours * 60)} minutes`
        return `${hours} hour${hours !== 1 ? "s" : ""}`
    }

    const getTimeOfDay = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 17) return "Good afternoon"
        return "Good evening"
    }

    const handleGetStarted = () => {
        router.push("/auth")
    }

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return

            try {
                setLoading(true)

                // Fetch user profile
                const profileResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/user/profile/${userId}`
                )

                if (!profileResponse.ok) {
                    throw new Error("User not found")
                }

                const profileData = await profileResponse.json()
                setProfile(profileData.data)

                // Fetch prep logs
                const logsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prep-logs?userId=${userId}`
                )

                if (logsResponse.ok) {
                    const logsData = await logsResponse.json()
                    setPrepLogs(logsData.data || [])
                }
            } catch (err) {
                setError("Failed to load user profile")
                console.error("Error fetching data:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [userId])

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className='min-h-screen bg-background'>
                <Navigation />
                <div className='container mx-auto px-4 py-16 text-center'>
                    <h1 className='text-4xl font-bold text-foreground mb-4'>
                        User Not Found
                    </h1>
                    <p className='text-muted-foreground mb-8'>
                        The user profile you're looking for doesn't exist or has
                        been made private.
                    </p>
                    <Button onClick={handleGetStarted}>
                        Start Your Own Journey
                    </Button>
                </div>
                <Footer />
            </div>
        )
    }

    const totalTimeSpent = prepLogs.reduce(
        (total, log) => total + log.timeSpent,
        0
    )
    const totalLogs = prepLogs.length

    return (
        <div className='min-h-screen bg-background'>
            <Navigation />

            <main className='container mx-auto px-4 py-16'>
                {/* Header Section */}
                <div className='text-center mb-16'>
                    <h1 className='text-4xl font-bold text-foreground mb-4'>
                        {getTimeOfDay()}! Meet{" "}
                        <span className='text-primary'>{profile.name}</span>
                    </h1>
                    <p className='text-xl text-muted-foreground mb-8'>
                        Following their interview preparation journey on
                        PrepYatra
                    </p>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12'>
                        <Card>
                            <CardContent className='flex items-center justify-center p-6'>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center mb-2'>
                                        <Target className='w-6 h-6 text-primary mr-2' />
                                        <span className='text-2xl font-bold'>
                                            {totalLogs}
                                        </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        Prep Sessions
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className='flex items-center justify-center p-6'>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center mb-2'>
                                        <Clock className='w-6 h-6 text-primary mr-2' />
                                        <span className='text-2xl font-bold'>
                                            {Math.round(totalTimeSpent)}
                                        </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        Hours Invested
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className='flex items-center justify-center p-6'>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center mb-2'>
                                        <TrendingUp className='w-6 h-6 text-primary mr-2' />
                                        <Badge
                                            variant='secondary'
                                            className='text-base px-3 py-1'>
                                            {profile.prepYatra
                                                .experienceLevel || "Learning"}
                                        </Badge>
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        Experience Level
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Profile Info */}
                <Card className='max-w-2xl mx-auto mb-12'>
                    <CardHeader className='text-center'>
                        <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <User className='w-10 h-10 text-primary' />
                        </div>
                        <CardTitle className='text-2xl'>
                            {profile.name}
                        </CardTitle>
                        <CardDescription>@{profile.username}</CardDescription>
                    </CardHeader>
                    <CardContent className='text-center space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                            <div>
                                <span className='font-medium'>
                                    Journey Started:
                                </span>
                                <br />
                                <span className='text-muted-foreground'>
                                    {formatDate(profile.createdAt)}
                                </span>
                            </div>
                            <div>
                                <span className='font-medium'>Goal:</span>
                                <br />
                                <span className='text-muted-foreground'>
                                    {profile.prepYatra.goal || "Not specified"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Prep Logs */}
                <div className='max-w-4xl mx-auto'>
                    <h2 className='text-3xl font-bold text-center mb-8'>
                        Recent Preparation Sessions
                    </h2>

                    {prepLogs.length === 0 ? (
                        <Card>
                            <CardContent className='text-center py-12'>
                                <p className='text-muted-foreground'>
                                    No preparation logs shared yet. Check back
                                    later!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className='grid gap-6'>
                            {prepLogs.slice(0, 10).map((log) => (
                                <Card key={log._id}>
                                    <CardHeader>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <CardTitle className='text-lg'>
                                                    {log.title}
                                                </CardTitle>
                                                <CardDescription className='flex items-center mt-2'>
                                                    <Calendar className='w-4 h-4 mr-2' />
                                                    {formatDate(log.createdAt)}
                                                    <Clock className='w-4 h-4 ml-4 mr-2' />
                                                    {formatTimeSpent(
                                                        log.timeSpent
                                                    )}
                                                </CardDescription>
                                            </div>
                                            <Badge variant='outline'>
                                                {formatTimeSpent(log.timeSpent)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    {log.description && (
                                        <CardContent>
                                            <p className='text-muted-foreground'>
                                                {log.description}
                                            </p>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className='text-center mt-16'>
                    <Card className='max-w-2xl mx-auto'>
                        <CardContent className='p-8'>
                            <h3 className='text-2xl font-bold mb-4'>
                                Start Your Own PrepYatra Journey
                            </h3>
                            <p className='text-muted-foreground mb-6'>
                                Track your interview preparation, connect with
                                recruiters, and showcase your progress just like{" "}
                                {profile.name}!
                            </p>
                            <Button size='lg' onClick={handleGetStarted}>
                                Get Started for Free
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default PrepLogsShowcase
