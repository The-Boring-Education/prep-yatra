import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Clock,
    Calendar,
    TrendingUp,
    Target,
    BookOpen,
    Zap,
    ArrowRight,
    Star,
    Flame,
    Trophy,
    Users,
    Rocket
} from "lucide-react"
import { usePrepStats } from "@/hooks/use-prep-stats"
import { useIntersectionObserver } from "@/hooks/use-mobile"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import UserSkillsShowcase from "@/components/UserSkillsShowcase"
import { useState } from "react"

const PrepLogsShowcase = () => {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<any>(null)
    const [profileLoading, setProfileLoading] = useState(true)

    const {
        stats,
        loading,
        error,
        totalTimeSpent,
        totalLogs,
        currentStreak,
        weeklyLogs
    } = usePrepStats(userId || "")

    const heroRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const logsRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    const isHeroVisible = useIntersectionObserver(heroRef, { threshold: 0.1 })
    const isStatsVisible = useIntersectionObserver(statsRef, { threshold: 0.1 })
    const isLogsVisible = useIntersectionObserver(logsRef, { threshold: 0.1 })
    const isCtaVisible = useIntersectionObserver(ctaRef, { threshold: 0.1 })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const formatTimeSpent = (hours: number) => {
        if (hours < 1) return `${Math.round(hours * 60)} minutes`
        if (hours === 1) return "1 hour"
        return `${hours} hours`
    }

    const getTimeOfDay = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "morning"
        if (hour < 17) return "afternoon"
        return "evening"
    }

    const handleGetStarted = () => {
        navigate("/auth")
    }

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return
            setProfileLoading(true)
            try {
                const res = await fetch(`${import.meta.env.VITE_TBE_WEBAPP_API_URL}/user?userId=${userId}`)
                const result = await res.json()
                if (result.status) {
                    setProfile(result.data)
                }
            } catch (err) {
                // ignore for now
            } finally {
                setProfileLoading(false)
            }
        }
        fetchProfile()
    }, [userId])

    if (loading || profileLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
                <Navigation />
                <div className='flex items-center justify-center min-h-[60vh]'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4'></div>
                        <p className='text-white text-lg'>
                            Loading prep journey...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !userId) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
                <Navigation />
                <div className='flex items-center justify-center min-h-[60vh]'>
                    <div className='text-center'>
                        <div className='w-24 h-24 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center'>
                            <BookOpen className='w-12 h-12 text-red-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-white mb-4'>
                            Journey Not Found
                        </h2>
                        <p className='text-gray-300 mb-8 max-w-md mx-auto'>
                            {error ||
                                "This prep journey doesn't exist or has been removed."}
                        </p>
                        <Button
                            onClick={handleGetStarted}
                            className='bg-primary hover:bg-primary/90'>
                            Start Your Own Journey
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
            <Navigation />

            {/* Hero Section */}
            <section
                ref={heroRef}
                className={`pt-20 pb-16 px-4 transition-all duration-1000 ${
                    isHeroVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                }`}>
                <div className='container mx-auto text-center'>
                    <div className='mb-8'>
                        <Badge className='bg-primary/20 text-primary border-primary/30 mb-4 animate-pulse'>
                            <Flame className='w-4 h-4 mr-2' />
                            {currentStreak > 0
                                ? `${currentStreak} Day${
                                      currentStreak > 1 ? "s" : ""
                                  } Streak!`
                                : "Starting Journey"}
                        </Badge>
                        <h1 className='text-4xl md:text-6xl font-bold text-white mb-6 leading-tight'>
                            Interview Prep
                            <br />
                            <span className='text-primary bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent'>
                                Journey
                            </span>
                        </h1>
                        <p className='text-xl text-gray-300 max-w-3xl mx-auto mb-8'>
                            Witness the dedication and hard work of someone
                            committed to their career growth. Every log
                            represents a step towards success.
                        </p>
                    </div>
                    {/* Public Skills Showcase */}
                    {profile && (
                        <div className="max-w-2xl mx-auto mb-8">
                            <UserSkillsShowcase
                                userSkills={profile.userSkills || []}
                                lastUpdated={profile.userSkillsLastUpdated || null}
                                title="Skills Showcase"
                            />
                        </div>
                    )}
                    {/* Quick Stats */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
                        <div className='glass rounded-2xl p-6 transform hover:scale-105 transition-all duration-300'>
                            <div className='w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center'>
                                <Clock className='w-8 h-8 text-primary' />
                            </div>
                            <h3 className='text-2xl font-bold text-white mb-2'>
                                {totalTimeSpent}
                            </h3>
                            <p className='text-gray-300'>Total Hours</p>
                        </div>

                        <div className='glass rounded-2xl p-6 transform hover:scale-105 transition-all duration-300'>
                            <div className='w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center'>
                                <BookOpen className='w-8 h-8 text-primary' />
                            </div>
                            <h3 className='text-2xl font-bold text-white mb-2'>
                                {totalLogs}
                            </h3>
                            <p className='text-gray-300'>Prep Sessions</p>
                        </div>

                        <div className='glass rounded-2xl p-6 transform hover:scale-105 transition-all duration-300'>
                            <div className='w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center'>
                                <TrendingUp className='w-8 h-8 text-primary' />
                            </div>
                            <h3 className='text-2xl font-bold text-white mb-2'>
                                {totalLogs > 0
                                    ? Math.round(
                                          (totalTimeSpent / totalLogs) * 10
                                      ) / 10
                                    : 0}
                            </h3>
                            <p className='text-gray-300'>Avg Hours/Session</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Stats Section */}
            <section
                ref={statsRef}
                className={`py-16 px-4 transition-all duration-1000 delay-300 ${
                    isStatsVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                }`}>
                <div className='container mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                            Journey Statistics
                        </h2>
                        <p className='text-gray-300 max-w-2xl mx-auto'>
                            Detailed breakdown of the preparation journey and
                            achievements
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        <Card className='glass-dark border-primary/20 hover:border-primary/40 transition-all duration-300'>
                            <CardHeader className='text-center'>
                                <div className='w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                    <Trophy className='w-6 h-6 text-white' />
                                </div>
                                <CardTitle className='text-white'>
                                    Current Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='text-center'>
                                <div className='text-3xl font-bold text-primary mb-2'>
                                    {currentStreak}
                                </div>
                                <p className='text-gray-300 text-sm'>
                                    consecutive days
                                </p>
                            </CardContent>
                        </Card>

                        <Card className='glass-dark border-primary/20 hover:border-primary/40 transition-all duration-300'>
                            <CardHeader className='text-center'>
                                <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                    <Calendar className='w-6 h-6 text-white' />
                                </div>
                                <CardTitle className='text-white'>
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='text-center'>
                                <div className='text-3xl font-bold text-primary mb-2'>
                                    {weeklyLogs.length}
                                </div>
                                <p className='text-gray-300 text-sm'>
                                    sessions this week
                                </p>
                            </CardContent>
                        </Card>

                        <Card className='glass-dark border-primary/20 hover:border-primary/40 transition-all duration-300'>
                            <CardHeader className='text-center'>
                                <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                    <Target className='w-6 h-6 text-white' />
                                </div>
                                <CardTitle className='text-white'>
                                    Consistency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='text-center'>
                                <div className='text-3xl font-bold text-primary mb-2'>
                                    {totalLogs > 0
                                        ? Math.round(
                                              (weeklyLogs.length / 7) * 100
                                          )
                                        : 0}
                                    %
                                </div>
                                <p className='text-gray-300 text-sm'>
                                    weekly consistency
                                </p>
                            </CardContent>
                        </Card>

                        <Card className='glass-dark border-primary/20 hover:border-primary/40 transition-all duration-300'>
                            <CardHeader className='text-center'>
                                <div className='w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                    <Zap className='w-6 h-6 text-white' />
                                </div>
                                <CardTitle className='text-white'>
                                    Intensity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='text-center'>
                                <div className='text-3xl font-bold text-primary mb-2'>
                                    {totalLogs > 0
                                        ? Math.round(
                                              (totalTimeSpent / totalLogs) * 10
                                          ) / 10
                                        : 0}
                                </div>
                                <p className='text-gray-300 text-sm'>
                                    hours per session
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Prep Logs Section */}
            <section
                ref={logsRef}
                className={`py-16 px-4 transition-all duration-1000 delay-500 ${
                    isLogsVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                }`}>
                <div className='container mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                            Prep Journey Logs
                        </h2>
                        <p className='text-gray-300 max-w-2xl mx-auto'>
                            Every entry represents dedication, learning, and
                            progress towards career goals
                        </p>
                    </div>

                    {weeklyLogs.length === 0 ? (
                        <div className='text-center py-16'>
                            <div className='w-24 h-24 bg-gray-700/50 rounded-full mx-auto mb-6 flex items-center justify-center'>
                                <BookOpen className='w-12 h-12 text-gray-400' />
                            </div>
                            <h3 className='text-2xl font-bold text-white mb-4'>
                                Journey Just Started
                            </h3>
                            <p className='text-gray-300 mb-8 max-w-md mx-auto'>
                                This person is just beginning their interview
                                preparation journey. Check back soon to see
                                their progress!
                            </p>
                        </div>
                    ) : (
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {weeklyLogs.map((log, index) => (
                                <Card
                                    key={log._id}
                                    className={`glass-dark border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 ${
                                        isLogsVisible
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-10"
                                    }`}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        transform: isLogsVisible
                                            ? "translateY(0)"
                                            : "translateY(20px)"
                                    }}>
                                    <CardHeader>
                                        <div className='flex items-center justify-between mb-2'>
                                            <CardTitle className='text-white text-lg line-clamp-2'>
                                                {log.title}
                                            </CardTitle>
                                            <Badge className='bg-primary/20 text-primary border-primary/30'>
                                                {formatTimeSpent(log.timeSpent)}
                                            </Badge>
                                        </div>
                                        <p className='text-sm text-gray-400'>
                                            {formatDate(log.createdAt)}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-gray-300 text-sm line-clamp-3'>
                                            {log.description ||
                                                "No description provided"}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action Section */}
            <section
                ref={ctaRef}
                className={`py-20 px-4 transition-all duration-1000 delay-700 ${
                    isCtaVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                }`}>
                <div className='container mx-auto text-center'>
                    <div className='glass rounded-3xl p-12 max-w-4xl mx-auto'>
                        <div className='mb-8'>
                            <div className='w-20 h-20 bg-gradient-to-br from-primary to-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center'>
                                <Rocket className='w-10 h-10 text-white' />
                            </div>
                            <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
                                Ready to Start Your Own Journey?
                            </h2>
                            <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
                                Join thousands of job seekers who are tracking
                                their interview preparation, building recruiter
                                networks, and accelerating their career growth.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                            <div className='text-center'>
                                <div className='w-12 h-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                    <BookOpen className='w-6 h-6 text-primary' />
                                </div>
                                <h3 className='text-white font-semibold mb-2'>
                                    Track Prep Logs
                                </h3>
                                <p className='text-gray-300 text-sm'>
                                    Monitor your learning progress
                                </p>
                            </div>

                            <div className='text-center'>
                                <div className='w-12 h-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                    <Users className='w-6 h-6 text-primary' />
                                </div>
                                <h3 className='text-white font-semibold mb-2'>
                                    Build Network
                                </h3>
                                <p className='text-gray-300 text-sm'>
                                    Connect with recruiters
                                </p>
                            </div>

                            <div className='text-center'>
                                <div className='w-12 h-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                    <Star className='w-6 h-6 text-primary' />
                                </div>
                                <h3 className='text-white font-semibold mb-2'>
                                    Share Resources
                                </h3>
                                <p className='text-gray-300 text-sm'>
                                    Learn from the community
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleGetStarted}
                            size='lg'
                            className='bg-primary hover:bg-primary/90 text-lg px-8 py-4 font-semibold transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50'>
                            🚀 Start Your Journey Free
                            <ArrowRight className='w-5 h-5 ml-2' />
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default PrepLogsShowcase
