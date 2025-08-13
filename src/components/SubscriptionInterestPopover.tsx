import { useState, useEffect } from "react"
import { X, Sparkles, Star, Zap, Users, Target, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/hooks/use-user"
import { toast } from "sonner"

interface SubscriptionInterestPopoverProps {
    className?: string
}

const SubscriptionInterestPopover = ({ className = "" }: SubscriptionInterestPopoverProps) => {
    const { user, isAuthenticated } = useUser()
    const [isLoading, setIsLoading] = useState(false)
    const [isInterested, setIsInterested] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    // Auto-open after a delay when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isVisible && isAuthenticated) {
                setIsOpen(true)
            }
        }, 2000) // 2 seconds after page load

        return () => clearTimeout(timer)
    }, [isVisible, isAuthenticated])

    // Hide popover permanently for session
    useEffect(() => {
        const hidden = sessionStorage.getItem('py-subscription-popover-hidden')
        if (hidden) {
            setIsVisible(false)
        }
    }, [])

    const subscriptionFeatures = [
        { icon: Star, text: "Advanced Resume Builder & ATS Optimization", color: "text-yellow-500" },
        { icon: Target, text: "AI-Powered Job Match & Application Tracker", color: "text-blue-500" },
        { icon: Users, text: "Direct Recruiter Connect & Networking", color: "text-green-500" },
        { icon: Zap, text: "Interview Prep with Mock Sessions", color: "text-purple-500" },
        { icon: Gift, text: "Salary Negotiation Templates & Tips", color: "text-red-500" },
    ]

    const handleInterestClick = async () => {
        if (!isAuthenticated || !user?.id) {
            toast.error('Please login to show your interest')
            return
        }

        if (isInterested) {
            toast.success('You\'re already on our interest list!')
            return
        }

        setIsLoading(true)
        try {
            // Call the webapp API from prep-yatra
            const response = await fetch('/api/v1/user/interest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    eventType: 'PREPYATRA_SUBSCRIPTION',
                    eventDescription: 'User interested in PrepYatra subscription from dashboard popover',
                    metadata: {
                        page: 'dashboard',
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                    },
                    source: 'PREPYATRA',
                }),
            })

            const data = await response.json()

            if (response.ok && data.status) {
                setIsInterested(true)
                toast.success('Thanks! We\'ll notify you when subscription launches 🚀')
                // Auto-close after success
                setTimeout(() => {
                    setIsOpen(false)
                    handleDismiss()
                }, 2000)
            } else {
                toast.error('Something went wrong. Please try again.')
            }
        } catch (error) {
            console.error('Error showing interest:', error)
            toast.error('Failed to register interest. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDismiss = () => {
        setIsVisible(false)
        setIsOpen(false)
        sessionStorage.setItem('py-subscription-popover-hidden', 'true')
    }

    if (!isVisible || !isAuthenticated) {
        return null
    }

    return (
        <div className={`fixed top-20 right-4 z-50 ${className}`}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg animate-pulse"
                        onClick={() => setIsOpen(true)}
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Premium Coming Soon
                        <Badge className="ml-2 bg-yellow-400 text-black text-xs">NEW</Badge>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-96 p-0 border-0 shadow-2xl bg-white">
                    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-6 w-6" />
                                <span className="font-bold text-lg">PrepYatra Premium</span>
                                <Badge className="bg-yellow-400 text-black text-xs font-medium">
                                    Coming Soon
                                </Badge>
                            </div>
                            <p className="text-blue-100 text-sm">
                                Transform your job search with premium features
                            </p>
                        </div>

                        {/* Features */}
                        <div className="p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 text-center">
                                What's Coming for You:
                            </h3>
                            
                            <div className="space-y-3 mb-6">
                                {subscriptionFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <feature.icon className={`h-5 w-5 mt-0.5 ${feature.color}`} />
                                        <span className="text-sm text-gray-700 leading-relaxed">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleInterestClick}
                                    disabled={isLoading || isInterested}
                                    className={`w-full font-medium transition-all duration-200 ${
                                        isInterested 
                                            ? "bg-green-600 hover:bg-green-700" 
                                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    }`}
                                >
                                    {isLoading 
                                        ? "Registering..." 
                                        : isInterested 
                                            ? "Interest Registered ✓" 
                                            : "Interested? Count Me In! 🚀"
                                    }
                                </Button>
                                
                                <Button
                                    variant="ghost"
                                    onClick={handleDismiss}
                                    className="w-full text-gray-600 hover:text-gray-800 text-sm"
                                >
                                    Maybe Later
                                </Button>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Be the first to know when we launch • No spam, ever
                            </p>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default SubscriptionInterestPopover