import React, { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { GamificationProvider } from "@/contexts/GamificationContext"
import AuthProvider from "@/contexts/AuthContext"
import PublicRoute from "@/components/PublicRoute"
import ProtectedRoute from "@/components/ProtectedRoute"
import PricingPage from "./pages/Pricing"
import { useUser } from "@/hooks/use-user"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// Lazy load page components for code splitting
const Index = lazy(() => import("./pages/Index"))
const Auth = lazy(() => import("./pages/Auth"))
const Onboarding = lazy(() => import("./pages/Onboarding"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const PrepLogsShowcase = lazy(() => import("./pages/PrepLogsShowcase"))

const NotFound = lazy(() => import("./pages/NotFound"))

// Loading component for Suspense fallback
const PageLoader = () => (
    <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
    </div>
)

// Error boundary component for chunk loading failures
const ChunkErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    const [hasError, setHasError] = React.useState(false)

    React.useEffect(() => {
        const handleChunkError = (event: ErrorEvent) => {
            if (
                event.message.includes(
                    "Failed to fetch dynamically imported module"
                )
            ) {
                console.error("Chunk loading failed:", event)
                setHasError(true)

                // Clear cache and reload after a short delay
                setTimeout(() => {
                    if ("caches" in window) {
                        caches.keys().then((names) => {
                            names.forEach((name) => {
                                caches.delete(name)
                            })
                        })
                    }
                    window.location.reload()
                }, 2000)
            }
        }

        window.addEventListener("error", handleChunkError)
        return () => window.removeEventListener("error", handleChunkError)
    }, [])

    if (hasError) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
                    <p className='text-gray-600 dark:text-gray-300'>
                        Loading new version...
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                        Please wait while we update the application
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
})

const AppContent = () => {
    const { user, loading, isAuthenticated } = useUser()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) return

        // Check if user is returning from external onboarding
        const urlParams = new URLSearchParams(window.location.search)
        const onboardingComplete = urlParams.get("onboardingComplete")
        const returnFromOnboarding = urlParams.get("returnFromOnboarding")

        if (onboardingComplete === "true" || returnFromOnboarding === "true") {
            // Clear the query parameters and redirect to dashboard
            const newUrl = window.location.pathname
            window.history.replaceState({}, "", newUrl)
            navigate("/dashboard")
            return
        }

        // Fetch onboarding status if authenticated
        if (isAuthenticated && user) {
            // Fetch user profile to check onboarding
            fetch(
                `${import.meta.env.VITE_TBE_WEBAPP_API_URL}/user?email=${
                    user.email
                }`
            )
                .then((res) => res.json())
                .then((data) => {
                    const isOnboarded = data?.data?.prepYatra?.pyOnboarded
                    if (!isOnboarded && location.pathname !== "/onboarding") {
                        // Redirect to external onboarding app
                        const onboardingBaseUrl = import.meta.env
                            .VITE_ONBOARDING_APP_URL
                        const params = new URLSearchParams({
                            userId: user.id || "",
                            from: "prepyatra",
                            redirect: `${window.location.origin}/dashboard`
                        })
                        // If token is available, add it
                        if ((user as { token?: string }).token) {
                            params.append(
                                "token",
                                (user as { token?: string }).token
                            )
                        }
                        window.location.href = `${onboardingBaseUrl}/?${params.toString()}`
                        return
                    } else if (
                        isOnboarded &&
                        location.pathname === "/onboarding"
                    ) {
                        navigate("/dashboard")
                    }
                })
        }
    }, [isAuthenticated, user, loading, location.pathname, navigate])

    return (
        <ChunkErrorBoundary>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path='/'
                        element={
                            <PublicRoute>
                                <Index />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path='/auth'
                        element={
                            <PublicRoute>
                                <Auth />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path='/journey/:userId'
                        element={
                            <PublicRoute>
                                <PrepLogsShowcase />
                            </PublicRoute>
                        }
                    />
                    {/* Protected Routes */}
                    <Route
                        path='/onboarding'
                        element={
                            <ProtectedRoute>
                                <Onboarding />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/dashboard'
                        element={
                            <ProtectedRoute requireOnboarding={true}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/pricing'
                        element={
                            <ProtectedRoute requireOnboarding={true}>
                                <PricingPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* 404 Route */}
                    <Route
                        path='*'
                        element={
                            <PublicRoute>
                                <NotFound />
                            </PublicRoute>
                        }
                    />
                </Routes>
            </Suspense>
        </ChunkErrorBoundary>
    )
}

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <AuthProvider>
                            <GamificationProvider>
                                <AppContent />
                            </GamificationProvider>
                        </AuthProvider>
                    </BrowserRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    )
}

export default App
