import React, { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "@/contexts/AuthContext"
import { GamificationProvider } from "@/contexts/GamificationContext"
import PublicRoute from "@/components/PublicRoute"
import ProtectedRoute from "@/components/ProtectedRoute"
import PricingPage from "./pages/Pricing"

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
                                            <ProtectedRoute
                                                requireOnboarding={true}>
                                                <Dashboard />
                                            </ProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path='/pricing'
                                        element={
                                            <ProtectedRoute
                                                requireOnboarding={true}>
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
                            </GamificationProvider>
                        </AuthProvider>
                    </BrowserRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    )
}

export default App
