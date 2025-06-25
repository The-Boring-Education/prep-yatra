import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, Award } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { User } from "@supabase/supabase-js"
import { RecruiterContact } from "@/types/recruiters"
import AddRecruiterModal from "@/components/AddRecruiterModal"
import RecruiterContactsTable from "@/components/RecruiterContactsTable"
import Navbar from "@/components/Navbar"
import AddPrepLogModal from "@/components/AddPrepLogModal"
import PrepLogList from "@/components/PrepLogsList"
import PrepLogCard from "@/components/PrepLogsList"

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
  experience_level: string
  createdAt: string
  prepYatra: {
    workExperience: number
    linkedInUrl?: string
    pyOnboarded: boolean
  }
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [recruiterContacts, setRecruiterContacts] = useState<RecruiterContact[]>([])
  const [prepLogs, setPrepLogs] = useState<PrepLog[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPrepLogModalOpen, setIsPrepLogModalOpen] = useState(false)

    const fetchRecruiterContacts = async (userId: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_TBE_BACKEND}/api/v1/prep-yatra/recruiter?userId=${userId}`);
            const result = await res.json();
            if (!result.status) throw new Error(result.message);

            const typedData: RecruiterContact[] = result.data.map((item) => ({
                _id: item._id,
                recruiterName: item.recruiterName,
                email: item.email || "",
                phone: item.phone || "",
                company: item.company || "",
                appliedPosition: item.appliedPosition || "",
                applicationStatus: item.applicationStatus || "Screening in Process",
                follow_up_date: item.follow_up_date || "",
                last_interview_date: item.last_interview_date || "",
                comments: item.comments || "",
                link: item.link || "",
                created_at: item.createdAt
            }));

            setRecruiterContacts(typedData);
        } catch (error) {
            console.error("Error fetching recruiter contacts:", error);
        }
    };

    
  const fetchPrepLogs = async (userId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_TBE_BACKEND}/api/v1/prep-yatra/prep-log?userId=${userId}`)
      const result = await res.json()
      if (!result.status) throw new Error(result.message)
      setPrepLogs(result.data)
    } catch (err) {
      console.error("Failed to fetch prep logs:", err)
    }
  }


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

            try {
                const res = await fetch(`${import.meta.env.VITE_TBE_BACKEND}/api/v1/user?email=${session.user.email}`);
                const result = await res.json();
                const profileData = result.data;

                if (!profileData?.prepYatra.pyOnboarded) {
                    navigate("/onboarding")
                    return
                }

                setProfile(profileData)
                await fetchRecruiterContacts(profileData._id)
               await fetchPrepLogs(profileData._id)
            } catch (err) {
                console.error("Failed to fetch profile:", err)
            } finally {
                setLoading(false)
            }
        }

        checkAuthAndProfile()
    }, [navigate])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate("/auth")
    }

  const handleContactAdded = () => {
    if (profile?._id) {
      fetchRecruiterContacts(profile._id)
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

      const totalTimeSpent = prepLogs.reduce((acc, log) => acc + (log.timeSpent || 0), 0)

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

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  <strong>Experience:</strong>{" "}
                  {profile?.prepYatra?.workExperience != null
                    ? `${profile.prepYatra.workExperience} year${
                        profile.prepYatra.workExperience > 1 ? "s" : ""
                      }`
                    : "Not specified"}
                </span>
              </div>

                            <div className='flex items-center gap-2 text-gray-300'>
                                <Calendar className='h-4 w-4 text-primary' />
                                <span className='text-sm'>
                                    <strong>Member since:</strong>{" "}
                                    {new Date(
                                        profile?.createdAt
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>

                            {profile?.prepYatra.linkedInUrl && (
                                <div className='flex items-center gap-2'>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                            window.open(
                                                profile.prepYatra.linkedInUrl,
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
                                            recruiterContacts[0]?.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

          {/* Prep Logs Card */}
          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">📝 Prep Logs</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{prepLogs.length}</div>
                <p className="text-gray-300 text-sm">Total Logs</p>
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-300">
                  ⏱️ Total Time Spent:{" "}
                  <span className="text-primary font-semibold">{totalTimeSpent} hrs</span>
                </div>
              </div>
              <Button
                onClick={() => setIsPrepLogModalOpen(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                + Add Prep Log
              </Button>
              {prepLogs.length > 0 && (
                <div className="text-center pt-2">
                  <p className="text-gray-400 text-sm">
                    Last log added {new Date(prepLogs[0]?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

                {/* Recruiter Contacts Table */}
                <RecruiterContactsTable
                    contacts={recruiterContacts}
                    onContactsChange={handleContactAdded}
                    mongoUserId={profile._id}
                />

        <PrepLogCard
          logs={prepLogs}
          onLogUpdated={() => fetchPrepLogs(profile._id)}
          mongoUserId={profile._id}
        />

        <AddRecruiterModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onContactAdded={handleContactAdded}
          mongoUserId={profile._id}
        />

        <AddPrepLogModal
          isOpen={isPrepLogModalOpen}
          onClose={() => setIsPrepLogModalOpen(false)}
          onLogAdded={() => fetchPrepLogs(profile._id)}
          mongoUserId={profile._id}
        />
      </div>
    </div>
  )
}

export default Dashboard
