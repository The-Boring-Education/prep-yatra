import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, MapPin, Calendar, Award } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { User } from "@supabase/supabase-js"
import { RecruiterContact } from "@/types/recruiters"
import AddRecruiterModal from "@/components/AddRecruiterModal"
import RecruiterContactsTable from "@/components/RecruiterContactsTable"
import Navbar from "@/components/Navbar"

const Dashboard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recruiterContacts, setRecruiterContacts] = useState<
        RecruiterContact[]
    >([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        const checkAuthAndProfile = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession()

            if (!session?.user) {
                navigate("/auth")
                return
            }

            setUser(session.user)

            // Get user profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single()

            if (!profileData?.onboarding_completed) {
                navigate("/onboarding")
                return
            }

            setProfile(profileData)
            await fetchRecruiterContacts(session.user.id)
            setLoading(false)
        }

        checkAuthAndProfile()
    }, [navigate])

    const fetchRecruiterContacts = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("recruiters")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            if (error) throw error

            // Type cast the data to ensure status field matches our union type
            const typedData: RecruiterContact[] = (data || []).map((item) => ({
                ...item,
                status: item.status as RecruiterContact["status"]
            }))

            setRecruiterContacts(typedData)
        } catch (error) {
            console.error("Error fetching recruiter contacts:", error)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate("/auth")
    }

    const handleContactAdded = () => {
        if (user) {
            fetchRecruiterContacts(user.id)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const formatExperienceLevel = (level: string) => {
        return level.charAt(0).toUpperCase() + level.slice(1)
    }

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-white'>Loading your dashboard...</div>
            </div>
        )
    }

    return (
        <div className='min-h-screen px-0 py-0'>
            <Navbar
                username={profile?.username || user?.email || "User"}
                onSignOut={handleSignOut}
            />
            <div className='container mx-auto px-4 py-8'>
                <div className='flex justify-between items-center mb-8'>
                    <div>
                        <h1 className='text-3xl font-bold text-white mb-2'>
                            Welcome back, {profile?.username}! 🚀
                        </h1>
                        <p className='text-gray-300'>
                            Ready to turn your hustle into hires?
                        </p>
                    </div>
                </div>

                <div className='grid md:grid-cols-3 gap-6 mb-8'>
                    {/* Enhanced Profile Section */}
                    <div className='glass-dark rounded-2xl p-6'>
                        <h3 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
                            👤 Your Profile
                        </h3>

                        <div className='flex items-center gap-4 mb-6'>
                            <Avatar className='h-16 w-16 border-2 border-primary/30'>
                                <AvatarImage
                                    src={
                                        user?.user_metadata?.avatar_url ||
                                        user?.user_metadata?.picture
                                    }
                                    alt={profile?.username || "User"}
                                />
                                <AvatarFallback className='bg-primary text-primary-foreground text-lg font-bold'>
                                    {profile?.username
                                        ? getInitials(profile.username)
                                        : "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className='flex-1'>
                                <h4 className='text-lg font-bold text-white'>
                                    {profile?.username}
                                </h4>
                                <p className='text-gray-300 text-sm'>
                                    {user?.user_metadata?.name || user?.email}
                                </p>
                                {profile?.experience_level && (
                                    <Badge
                                        variant='secondary'
                                        className='mt-1 bg-primary/20 text-primary text-xs'>
                                        {formatExperienceLevel(
                                            profile.experience_level
                                        )}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className='space-y-3'>
                            <div className='flex items-center gap-2 text-gray-300'>
                                <Award className='h-4 w-4 text-primary' />
                                <span className='text-sm'>
                                    <strong>Experience:</strong>{" "}
                                    {profile?.experience_level
                                        ? formatExperienceLevel(
                                              profile.experience_level
                                          )
                                        : "Not specified"}
                                </span>
                            </div>

                            <div className='flex items-center gap-2 text-gray-300'>
                                <Calendar className='h-4 w-4 text-primary' />
                                <span className='text-sm'>
                                    <strong>Member since:</strong>{" "}
                                    {new Date(
                                        profile?.created_at
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>

                            {profile?.linkedin_url && (
                                <div className='flex items-center gap-2'>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                            window.open(
                                                profile.linkedin_url,
                                                "_blank"
                                            )
                                        }
                                        className='text-primary hover:bg-primary/10 p-0 h-auto font-normal justify-start'>
                                        <ExternalLink className='h-4 w-4 mr-2' />
                                        View LinkedIn Profile
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recruiter Contacts Section */}
                    <div className='glass-dark rounded-2xl p-6'>
                        <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
                            📞 Recruiter Network
                        </h3>
                        <div className='space-y-4'>
                            <div className='text-center'>
                                <div className='text-3xl font-bold text-primary mb-1'>
                                    {recruiterContacts.length}
                                </div>
                                <p className='text-gray-300 text-sm'>
                                    Active Contacts
                                </p>
                            </div>

                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
                                Add New Contact
                            </Button>

                            {recruiterContacts.length > 0 && (
                                <div className='text-center pt-2'>
                                    <p className='text-gray-400 text-sm'>
                                        Last contact added{" "}
                                        {new Date(
                                            recruiterContacts[0]?.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Prep Logs Section */}
                    <div className='glass-dark rounded-2xl p-6'>
                        <h3 className='text-xl font-bold text-white mb-4'>
                            📝 Prep Logs
                        </h3>
                        <p className='text-gray-300 mb-4'>
                            Track your preparation progress
                        </p>
                        <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
                            Add Log
                        </Button>
                    </div>
                </div>

                {/* Recruiter Contacts Table */}
                <RecruiterContactsTable
                    contacts={recruiterContacts}
                    onContactsChange={handleContactAdded}
                />

                {/* Get Started Section */}
                <div className='mt-8 text-center'>
                    <div className='glass-dark rounded-2xl p-8'>
                        <h2 className='text-2xl font-bold text-white mb-4'>
                            🎯 Your Journey Starts Here
                        </h2>
                        <p className='text-gray-300 mb-6'>
                            PrepYatra is your companion in turning hustle into
                            hires.
                            {recruiterContacts.length === 0
                                ? "Start by adding your first recruiter contact!"
                                : "Keep building your network and tracking your progress!"}
                        </p>
                        <div className='flex gap-4 justify-center'>
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className='bg-primary text-primary-foreground hover:bg-primary/90'>
                                🚀{" "}
                                {recruiterContacts.length === 0
                                    ? "Add First Contact"
                                    : "Add More Contacts"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Add Recruiter Modal */}
                <AddRecruiterModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onContactAdded={handleContactAdded}
                />
            </div>
        </div>
    )
}

export default Dashboard
