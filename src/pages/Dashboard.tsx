import React, { useState, useEffect, Suspense, lazy } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/useAuth"
import { useGamificationContext } from "@/contexts/GamificationContext"
import { usePrepLogs } from "@/hooks/use-prep-logs"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
    Calendar,
    ExternalLink,
    Github,
    Linkedin,
    MessageSquare,
    Plus,
    Settings,
    Users
} from "lucide-react"

// Lazy load components for better performance
const Navbar = lazy(() => import("@/components/Navbar"))
const AddPrepLogModal = lazy(() => import("@/components/AddPrepLogModal"))
const PrepLogsList = lazy(() => import("@/components/PrepLogsList"))
const AddRecruiterModal = lazy(() => import("@/components/AddRecruiterModal"))
const RecruiterContactsTable = lazy(
    () => import("@/components/RecruiterContactsTable")
)
const EditOnboardingModal = lazy(
    () => import("@/components/EditOnboardingModal")
)
const GamificationDisplay = lazy(
    () => import("@/components/GamificationDisplay")
)
const BuildYourStack = lazy(() => import("@/components/BuildYourStack"))
const DailyPrepEncouragement = lazy(
    () => import("@/components/DailyPrepEncouragement")
)
const AddSkillsModal = lazy(() => import("@/components/AddSkillsModal"))
const UserSkillsShowcase = lazy(() => import("@/components/UserSkillsShowcase"))

// Loading component for Suspense fallback
const ComponentLoader = () => (
    <div className='flex items-center justify-center h-32'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
    </div>
)

// Type definitions (same as original)
type PrepLog = {
    _id: string
    userId: string
    title: string
    description?: string
    timeSpent: number
    createdAt: string
}

type Profile = {
    _id: string
    name: string
    username: string
    userName?: string
    createdAt: string
    linkedInUrl?: string
    githubUrl?: string
    leetCodeUrl?: string
    userSkills?: string[]
    userSkillsLastUpdated?: string
    prepYatra: {
        workExperience: number
        pyOnboarded: boolean
        goal?: string
        targetCompanies?: string[]
        experienceLevel?: string
        preferences?: {
            interviewCategories: string[]
            focusAreas: string[]
        }
    }
}

// Utility function to add protocol to URLs
function withProtocol(url: string | undefined) {
    if (!url) return undefined
    return url.startsWith("http") ? url : `https://${url}`
}

const Dashboard = () => {
    // State management
    const [isAddPrepLogModalOpen, setIsAddPrepLogModalOpen] = useState(false)
    const [isAddRecruiterModalOpen, setIsAddRecruiterModalOpen] =
        useState(false)
    const [isEditOnboardingModalOpen, setIsEditOnboardingModalOpen] =
        useState(false)
    const [isAddSkillsModalOpen, setIsAddSkillsModalOpen] = useState(false)
    const [recruiterContacts, setRecruiterContacts] = useState([])
    const [prepLogs, setPrepLogs] = useState<PrepLog[]>([])
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    // Hooks
    const router = useRouter()
    const { user, signOut } = useAuth()
    const { showCelebration } = useGamificationContext()
    const {
        logs,
        loading: prepLogsLoading,
        refetch: refetchPrepLogs
    } = usePrepLogs(user?.id || "")

    // Fetch recruiter contacts
    const fetchRecruiterContacts = async (userId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/user/recruiter-contacts?user=${userId}`
            )
            if (response.ok) {
                const data = await response.json()
                setRecruiterContacts(data.data || [])
            }
        } catch (error) {
            console.error("Error fetching recruiter contacts:", error)
        }
    }

    // Fetch prep logs
    const fetchPrepLogs = async (userId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prep-logs?userId=${userId}`
            )
            if (response.ok) {
                const data = await response.json()
                setPrepLogs(data.data || [])
            }
        } catch (error) {
            console.error("Error fetching prep logs:", error)
        }
    }

    // Fetch profile data
    const refetchProfile = async () => {
        if (!user?.email) return

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/user?email=${user.email}`
            )
            if (response.ok) {
                const data = await response.json()
                setProfile(data.data)
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        }
    }

    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            if (!user?.id) {
                setLoading(false)
                return
            }

            try {
                await Promise.all([
                    fetchRecruiterContacts(user.id),
                    fetchPrepLogs(user.id),
                    refetchProfile()
                ])
            } catch (error) {
                console.error("Error initializing dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        const checkAuthAndProfile = async () => {
            if (!user?.id) {
                router.push("/auth")
                return
            }

            // Check if user is onboarded
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/user?email=${user.email}`
                )
                const data = await response.json()

                if (!data?.data?.prepYatra?.pyOnboarded) {
                    router.push("/onboarding")
                    return
                }

                initializeData()
            } catch (error) {
                console.error("Error checking onboarding status:", error)
                initializeData()
            }
        }

        checkAuthAndProfile()
    }, [user, router])

    // Event handlers
    const handleSignOut = async () => {
        try {
            await signOut()
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    const handleContactAdded = () => {
        if (user?.id) {
            fetchRecruiterContacts(user.id)
            showCelebration(5)
            toast.success("Recruiter contact added successfully!")
        }
    }

    const handleLogAdded = () => {
        if (user?.id) {
            fetchPrepLogs(user.id)
            refetchPrepLogs()
            showCelebration(10)
            toast.success("Prep log added successfully!")
        }
    }

    const handleContactUpdated = () => {
        if (user?.id) {
            fetchRecruiterContacts(user.id)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-background'>
            <Suspense fallback={<ComponentLoader />}>
                <Navbar
                    username={user?.name || ""}
                    onSignOut={handleSignOut}
                    userId={user?.id}
                />
            </Suspense>

            <main className='container mx-auto px-4 py-8'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Profile Section */}
                    <div className='lg:col-span-1'>
                        <Card className='mb-6'>
                            <CardHeader className='text-center'>
                                <Avatar className='w-20 h-20 mx-auto mb-4'>
                                    <AvatarImage
                                        src={user?.picture}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback className='text-lg'>
                                        {getInitials(user?.name || "")}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className='text-xl'>
                                    {profile?.name || user?.name}
                                </CardTitle>
                                <CardDescription>
                                    @
                                    {profile?.username ||
                                        user?.name?.toLowerCase()}
                                </CardDescription>

                                {/* Social Links */}
                                <div className='flex justify-center space-x-3 mt-4'>
                                    {profile?.linkedInUrl && (
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            asChild>
                                            <a
                                                href={withProtocol(
                                                    profile.linkedInUrl
                                                )}
                                                target='_blank'
                                                rel='noopener noreferrer'>
                                                <Linkedin className='w-4 h-4' />
                                            </a>
                                        </Button>
                                    )}
                                    {profile?.githubUrl && (
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            asChild>
                                            <a
                                                href={withProtocol(
                                                    profile.githubUrl
                                                )}
                                                target='_blank'
                                                rel='noopener noreferrer'>
                                                <Github className='w-4 h-4' />
                                            </a>
                                        </Button>
                                    )}
                                    {profile?.leetCodeUrl && (
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            asChild>
                                            <a
                                                href={withProtocol(
                                                    profile.leetCodeUrl
                                                )}
                                                target='_blank'
                                                rel='noopener noreferrer'>
                                                <ExternalLink className='w-4 h-4' />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Experience:
                                        </span>
                                        <Badge variant='secondary'>
                                            {profile?.prepYatra
                                                ?.experienceLevel || "Not set"}
                                        </Badge>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Goal:
                                        </span>
                                        <Badge variant='outline'>
                                            {profile?.prepYatra?.goal ||
                                                "Not set"}
                                        </Badge>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            Joined:
                                        </span>
                                        <span>
                                            {new Date(
                                                profile?.createdAt || ""
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant='outline'
                                    className='w-full mt-4 bg-primary text-primary-foreground'
                                    onClick={() =>
                                        setIsEditOnboardingModalOpen(true)
                                    }>
                                    <Settings className='w-4 h-4 mr-2' />
                                    Edit Profile
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Skills Section */}
                        <Card className='mt-6'>
                            <CardHeader>
                                <CardTitle className='text-lg'>
                                    Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Suspense fallback={<ComponentLoader />}>
                                    <UserSkillsShowcase
                                        userSkills={profile?.userSkills || []}
                                        lastUpdated={
                                            profile?.userSkillsLastUpdated
                                        }
                                    />
                                </Suspense>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='w-full mt-3 bg-secondary text-secondary-foreground'
                                    onClick={() =>
                                        setIsAddSkillsModalOpen(true)
                                    }>
                                    <Plus className='w-4 h-4 mr-2' />
                                    Update Skills
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className='lg:col-span-2'>
                        {/* Daily Encouragement */}
                        <Suspense fallback={<ComponentLoader />}>
                            <DailyPrepEncouragement
                                userId={user?.id || ""}
                                onAddPrepLog={() =>
                                    setIsAddPrepLogModalOpen(true)
                                }
                                className='mb-6'
                            />
                        </Suspense>

                        {/* Tabs for different sections */}
                        <Tabs defaultValue='prep-logs' className='w-full'>
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='prep-logs'>
                                    Prep Logs
                                </TabsTrigger>
                                <TabsTrigger value='recruiters'>
                                    Recruiters
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value='prep-logs'
                                className='space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-2xl font-bold'>
                                        Preparation Logs
                                    </h2>
                                    <Button
                                        onClick={() =>
                                            setIsAddPrepLogModalOpen(true)
                                        }>
                                        <Plus className='w-4 h-4 mr-2' />
                                        Add Log
                                    </Button>
                                </div>

                                <Suspense fallback={<ComponentLoader />}>
                                    <PrepLogsList
                                        logs={logs}
                                        onLogUpdated={handleLogAdded}
                                        mongoUserId={user?.id || ""}
                                    />
                                </Suspense>
                            </TabsContent>

                            <TabsContent
                                value='recruiters'
                                className='space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-2xl font-bold'>
                                        Recruiter Contacts
                                    </h2>
                                    <Button
                                        onClick={() =>
                                            setIsAddRecruiterModalOpen(true)
                                        }>
                                        <Plus className='w-4 h-4 mr-2' />
                                        Add Contact
                                    </Button>
                                </div>

                                <Suspense fallback={<ComponentLoader />}>
                                    <RecruiterContactsTable
                                        contacts={recruiterContacts}
                                        onContactAdded={handleContactAdded}
                                        onContactUpdated={handleContactUpdated}
                                        mongoUserId={user?.id}
                                    />
                                </Suspense>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <Suspense fallback={null}>
                <AddPrepLogModal
                    isOpen={isAddPrepLogModalOpen}
                    onClose={() => setIsAddPrepLogModalOpen(false)}
                    onLogAdded={handleLogAdded}
                    mongoUserId={user?.id || ""}
                />
            </Suspense>

            <Suspense fallback={null}>
                <AddRecruiterModal
                    isOpen={isAddRecruiterModalOpen}
                    onClose={() => setIsAddRecruiterModalOpen(false)}
                    onContactAdded={handleContactAdded}
                    mongoUserId={user?.id || ""}
                />
            </Suspense>

            <Suspense fallback={null}>
                <EditOnboardingModal
                    isOpen={isEditOnboardingModalOpen}
                    onClose={() => setIsEditOnboardingModalOpen(false)}
                    onUpdate={refetchProfile}
                    currentData={profile}
                    userId={user?.id || ""}
                />
            </Suspense>

            <Suspense fallback={null}>
                <AddSkillsModal
                    isOpen={isAddSkillsModalOpen}
                    onClose={() => setIsAddSkillsModalOpen(false)}
                    userId={user?.id || ""}
                    userSkills={profile?.userSkills || []}
                    lastUpdated={profile?.userSkillsLastUpdated}
                    onSkillsUpdated={refetchProfile}
                />
            </Suspense>
        </div>
    )
}

export default Dashboard
