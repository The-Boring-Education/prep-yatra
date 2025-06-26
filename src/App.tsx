import React, { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Lazy load page components for code splitting
const Index = lazy(() => import("./pages/Index"))
const Auth = lazy(() => import("./pages/Auth"))
const Onboarding = lazy(() => import("./pages/Onboarding"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
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
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path='/' element={<Index />} />
                            <Route path='/auth' element={<Auth />} />
                            <Route
                                path='/onboarding'
                                element={<Onboarding />}
                            />
                            <Route path='/dashboard' element={<Dashboard />} />
                            <Route path='*' element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    )
}

export default App
