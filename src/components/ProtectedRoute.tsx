import React, { ReactNode, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/useAuth"

interface ProtectedRouteProps {
    children: ReactNode
    requireOnboarding?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireOnboarding = false
}) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Store the intended destination for after login
                localStorage.setItem("redirectAfterLogin", router.pathname)
                router.push("/auth")
                return
            }

            if (requireOnboarding) {
                // Check if user needs onboarding
                const checkOnboarding = async () => {
                    try {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/user?email=${user.email}`
                        )
                        const data = await res.json()

                        if (!data?.data?.prepYatra?.pyOnboarded) {
                            // Redirect to external onboarding app
                            const onboardingBaseUrl =
                                process.env.NEXT_PUBLIC_ONBOARDING_APP_URL
                            const params = new URLSearchParams({
                                userId: user.id || "",
                                from: "prepyatra",
                                redirect: `${window.location.origin}/dashboard`
                            })
                            if ((user as any).token) {
                                params.append("token", (user as any).token)
                            }
                            window.location.href = `${onboardingBaseUrl}/?${params.toString()}`
                            return
                        }
                    } catch (error) {
                        console.error("Error checking onboarding:", error)
                        // On error, also redirect to external onboarding app
                        const onboardingBaseUrl =
                            process.env.NEXT_PUBLIC_ONBOARDING_APP_URL
                        const params = new URLSearchParams({
                            userId: user.id || "",
                            from: "prepyatra",
                            redirect: `${window.location.origin}/dashboard`
                        })
                        if ((user as any).token) {
                            params.append("token", (user as any).token)
                        }
                        window.location.href = `${onboardingBaseUrl}/?${params.toString()}`
                        return
                    }
                }

                checkOnboarding()
            }
        }
    }, [user, loading, router, requireOnboarding])

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect to auth
    }

    return <>{children}</>
}

export default ProtectedRoute
