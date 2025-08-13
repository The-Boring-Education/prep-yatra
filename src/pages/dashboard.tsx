import React, { useState, useEffect, Suspense, lazy } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/useAuth"
import { useGamificationContext } from "@/contexts/GamificationContext"
import { usePrepLogs } from "@/hooks/use-prep-logs"
import { recruitersService } from "@/services/recruiters"
import { RecruiterContact } from "@/types/recruiters"
import { toast } from "sonner"

// Dashboard Components
import { ProfileSection, DashboardTabs, LoadingSpinner } from "@/components/dashboard"

// Lazy load components for better performance
const Navbar = lazy(() => import("@/components/layout/Navbar"))
const AddPrepLogModal = lazy(() => import("@/components/modals/AddPrepLogModal"))
const AddRecruiterModal = lazy(() => import("@/components/modals/AddRecruiterModal"))
const EditOnboardingModal = lazy(() => import("@/components/modals/EditOnboardingModal"))
const GamificationDisplay = lazy(() => import("@/components/gamification/GamificationDisplay"))
const BuildYourStack = lazy(() => import("@/components/features/BuildYourStack"))
const DailyPrepEncouragement = lazy(() => import("@/components/features/DailyPrepEncouragement"))
const SubscriptionInterestPopover = lazy(() => import("@/components/popovers/SubscriptionInterestPopover"))
const AddSkillsModal = lazy(() => import("@/components/modals/AddSkillsModal"))

// Loading component for Suspense fallback
const ComponentLoader = () => (
    <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
)

// Type definitions

type Profile = {
    _id?: string
    name?: string
    username?: string
    linkedInUrl?: string
    githubUrl?: string
    leetCodeUrl?: string
    prepYatra?: {
        experienceLevel?: string
        goal?: string
        skills?: string[]
    }
    createdAt?: string
}

const Dashboard = () => {
    const router = useRouter()
    const { user, loading: authLoading, signOut } = useAuth()
    const { showCelebration } = useGamificationContext()
    const { logs: prepLogs, loading: prepLogsLoading, refetch: refetchPrepLogs } = usePrepLogs(user?.id)

    // State management
    const [profile, setProfile] = useState<Profile | null>(null)
    const [recruiterContacts, setRecruiterContacts] = useState<RecruiterContact[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Modal states
    const [isPrepLogModalOpen, setIsPrepLogModalOpen] = useState(false)
    const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false)

    // Data fetching functions
    const fetchProfile = async (userId: string) => {
        try {
            const response = await fetch(`/api/profile?userId=${userId}`)
            if (response.ok) {
                const data = await response.json()
                setProfile(data)
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        }
    }

    const fetchRecruiterContacts = async (userId: string) => {
        try {
            const contacts = await recruitersService.getByUserId(userId)
            setRecruiterContacts(contacts)
        } catch (error) {
            console.error("Error fetching recruiter contacts:", error)
        }
        }

        const initializeData = async () => {
        if (!user?.id) return

        setLoading(true)
            try {
                await Promise.all([
                fetchProfile(user.id),
                fetchRecruiterContacts(user.id)
                ])
            } catch (error) {
            console.error("Error initializing data:", error)
            } finally {
                setLoading(false)
            }
        }

    // Effects
    useEffect(() => {
        const checkAuthAndProfile = async () => {
            if (authLoading) return

            if (!user) {
                router.push("/auth")
                return
            }

            try {
                // Check if user needs onboarding
                const response = await fetch(`/api/profile?userId=${user.id}`)
                if (!response.ok) {
                    const onboardingUrl = process.env.NEXT_PUBLIC_ONBOARDING_URL
                    if (onboardingUrl) {
                        const redirectUrl = `${onboardingUrl}?userId=${user.id}&from=prepyatra&redirect=${encodeURIComponent(window.location.origin + "/dashboard")}`
                        window.location.href = redirectUrl
                    } else {
                        router.push("/onboarding")
                    }
                    return
                }

                initializeData()
            } catch (error) {
                console.error("Error checking onboarding status:", error)
                initializeData()
            }
        }

        checkAuthAndProfile()
    }, [user, router, authLoading])

    // Refetch data when refreshTrigger changes
    useEffect(() => {
        if (user?.id && refreshTrigger > 0 && !authLoading) {
            fetchRecruiterContacts(user.id)
            refetchPrepLogs()
        }
    }, [refreshTrigger, user?.id, authLoading, refetchPrepLogs])

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
            setRefreshTrigger(prev => prev + 1)
            showCelebration(5)
            toast.success("Recruiter contact added successfully!")
        }
    }

    const handleLogAdded = () => {
        if (user?.id) {
            setRefreshTrigger(prev => prev + 1)
            showCelebration(10)
            toast.success("Prep log added successfully!")
        }
    }

    const handleContactUpdated = () => {
        if (user?.id) {
            setRefreshTrigger(prev => prev + 1)
        }
    }

    const handleSkillsUpdated = () => {
        if (user?.id) {
            fetchProfile(user.id)
            toast.success("Skills updated successfully!")
        }
    }

    if (loading || authLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen bg-background">
            <Suspense fallback={<ComponentLoader />}>
                <Navbar
                    username={user?.name || ""}
                    onSignOut={handleSignOut}
                    userId={user?.id}
                />
            </Suspense>

            <Suspense fallback={null}>
                <SubscriptionInterestPopover />
            </Suspense>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Section */}
                    <div className="lg:col-span-1">
                        <ProfileSection user={user} profile={profile} />

                        {/* Additional components */}
                        <Suspense fallback={<ComponentLoader />}>
                            <GamificationDisplay userId={user?.id || ""} />
                        </Suspense>

                                <Suspense fallback={<ComponentLoader />}>
                            <BuildYourStack 
                                userId={user?.id || ""} 
                                userSkills={profile?.prepYatra?.skills || []} 
                            />
                                </Suspense>

                                <Suspense fallback={<ComponentLoader />}>
                            <DailyPrepEncouragement 
                                userId={user?.id || ""} 
                                onAddPrepLog={() => setIsPrepLogModalOpen(true)} 
                            />
                                </Suspense>
                                </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <DashboardTabs
                            prepLogs={prepLogs}
                            recruiterContacts={recruiterContacts}
                            user={user}
                            profile={profile}
                            onPrepLogModalOpen={() => setIsPrepLogModalOpen(true)}
                            onRecruiterModalOpen={() => setIsRecruiterModalOpen(true)}
                            onSkillsModalOpen={() => setIsSkillsModalOpen(true)}
                                        onContactUpdated={handleContactUpdated}
                                    />
                    </div>
                </div>
            </main>

            {/* Modals */}
            <Suspense fallback={null}>
                <AddPrepLogModal
                    isOpen={isPrepLogModalOpen}
                    onClose={() => setIsPrepLogModalOpen(false)}
                    onLogAdded={handleLogAdded}
                    mongoUserId={user?.id || ""}
                />
            </Suspense>

            <Suspense fallback={null}>
                <AddRecruiterModal
                    isOpen={isRecruiterModalOpen}
                    onClose={() => setIsRecruiterModalOpen(false)}
                    onContactAdded={handleContactAdded}
                    mongoUserId={user?.id || ""}
                />
            </Suspense>

            <Suspense fallback={null}>
                <EditOnboardingModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={() => {
                        if (user?.id) {
                            fetchProfile(user.id)
                        }
                    }}
                    currentData={profile as any}
                    userId={user?.id || ""}
                />
            </Suspense>

            <Suspense fallback={null}>
                <AddSkillsModal
                    isOpen={isSkillsModalOpen}
                    onClose={() => setIsSkillsModalOpen(false)}
                    userId={user?.id || ""}
                    userSkills={profile?.prepYatra?.skills || []}
                    onSkillsUpdated={handleSkillsUpdated}
                />
            </Suspense>
        </div>
    )
}

export default Dashboard