import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

const Onboarding = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const { user } = useAuth()
    const [centralUserId, setCentralUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        linkedInUrl: "",
        workExperience: "",
        workDomain: ""
    })

    useEffect(() => {
        const checkAuthAndFetchCentralUser = async () => {
            if (!user) {
                navigate("/auth")
                return
            }

            try {
                const res = await fetch(
                    `${
                        import.meta.env.VITE_TBE_WEBAPP_API_URL
                    }/api/v1/user?email=${user.email}`
                )
                const result = await res.json()

                if (!result?.status || !result?.data?._id) {
                    throw new Error("User not found in central DB")
                }

                setCentralUserId(result.data._id)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Could not verify user. Please try again.",
                    variant: "destructive"
                })
                navigate("/auth")
            }
        }

        checkAuthAndFetchCentralUser()
    }, [navigate, toast, user])

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user || !centralUserId) return

        const { workExperience, workDomain, linkedInUrl } = formData

        if (!workExperience || !workDomain) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            })
            return
        }

        try {
            setLoading(true)

            const response = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/api/v1/user/onbording?userId=${centralUserId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        workExperience: parseInt(workExperience),
                        workDomain,
                        linkedInUrl
                    })
                }
            )

            const result = await response.json()

            if (!result.status)
                throw new Error(result.message || "Onboarding failed")

            toast({
                title: "Welcome to PrepYatra!",
                description: "Your profile has been set up successfully."
            })

            navigate("/dashboard")
        } catch (error) {
            console.error("Onboarding error:", error)
            toast({
                title: "Error",
                description: "Failed to complete onboarding. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-white'>Loading...</div>
            </div>
        )
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden'>
            {/* Background Animation Elements */}
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-float'></div>
                <div
                    className='absolute top-60 right-20 w-24 h-24 bg-primary/30 rounded-full animate-float'
                    style={{ animationDelay: "1s" }}></div>
                <div
                    className='absolute bottom-40 left-1/4 w-20 h-20 bg-primary/25 rounded-full animate-float'
                    style={{ animationDelay: "2s" }}></div>
            </div>

            <div className='glass-dark rounded-2xl p-8 w-full max-w-md animate-scale-in relative z-10'>
                <div className='text-center mb-8'>
                    <div className='text-center mb-6'>
                        <span className='block text-3xl font-bold text-primary'>
                            PrepYatra
                        </span>
                        <span className='block text-sm text-gray-300 mt-1'>
                            by The Boring Education
                        </span>
                    </div>
                    <h1 className='text-2xl font-bold text-white mb-2'>
                        Complete Your Profile
                    </h1>
                    <p className='text-gray-300'>
                        Let's get you set up for success!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* LinkedIn Url */}
                    <div>
                        <Label
                            htmlFor='linkedInUrl'
                            className='text-white font-medium'>
                            LinkedIn Url
                        </Label>
                        <Input
                            id='linkedInUrl'
                            type='url'
                            placeholder='https://www.linkedin.com/in/your-profile'
                            value={formData.linkedInUrl}
                            onChange={(e) =>
                                handleInputChange("linkedInUrl", e.target.value)
                            }
                            className='mt-2 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400'
                        />
                    </div>
                    {/* Work Experience */}
                    <div>
                        <Label
                            htmlFor='workExperience'
                            className='text-white font-medium'>
                            Work Experience (Years) *
                        </Label>
                        <Input
                            id='workExperience'
                            type='number'
                            placeholder='e.g. 2'
                            value={formData.workExperience}
                            onChange={(e) =>
                                handleInputChange(
                                    "workExperience",
                                    e.target.value
                                )
                            }
                            className='mt-2 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400'
                            required
                        />
                    </div>

                    {/* Work Domain */}
                    <div>
                        <Label className='text-white font-medium mb-4 block'>
                            Work Domain *
                        </Label>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3'>
                            {[
                                "MERN Full-stack",
                                "Java Full-stack",
                                "Python Full-stack",
                                "Data Analysis",
                                "Machine Learning",
                                "AI",
                                "App Development",
                                "Others"
                            ].map((domain) => (
                                <button
                                    type='button'
                                    key={domain}
                                    onClick={() =>
                                        handleInputChange("workDomain", domain)
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                        formData.workDomain === domain
                                            ? "bg-primary text-white border-primary"
                                            : "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-700"
                                    }`}>
                                    {domain}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105'>
                        {loading
                            ? "Setting up your profile..."
                            : "Complete Setup"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Onboarding
