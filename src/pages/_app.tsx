import React, { useEffect } from "react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { GamificationProvider } from "@/contexts/GamificationContext"
import AuthProvider from "@/contexts/AuthContext"
import "@/styles/globals.css"

// Create a stable QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false
        },
        mutations: {
            retry: 1
        }
    }
})

// Simple error boundary component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='flex items-center justify-center min-h-screen'>
                    <div className='text-center'>
                        <h2 className='text-xl font-semibold mb-4'>
                            Something went wrong
                        </h2>
                        <p className='text-gray-600 mb-4'>
                            Please refresh the page to try again
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'>
                            Refresh Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

// Environment validation component
const EnvironmentValidator = () => {
    useEffect(() => {
        // Log environment variables for debugging (only in development)
        if (process.env.NODE_ENV === "development") {
            console.log("Environment variables check:")
            console.log(
                "NEXT_PUBLIC_GOOGLE_CLIENT_ID:",
                process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "Set" : "Missing"
            )
            console.log(
                "NEXT_PUBLIC_TBE_WEBAPP_API_URL:",
                process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL ? "Set" : "Missing"
            )
            console.log(
                "NEXT_PUBLIC_ONBOARDING_APP_URL:",
                process.env.NEXT_PUBLIC_ONBOARDING_APP_URL ? "Set" : "Missing"
            )
        }

        // Check for critical missing environment variables
        const missingVars = []
        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
            missingVars.push("NEXT_PUBLIC_GOOGLE_CLIENT_ID")
        }
        if (!process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL) {
            missingVars.push("NEXT_PUBLIC_TBE_WEBAPP_API_URL")
        }

        if (missingVars.length > 0) {
            console.error(
                "Missing critical environment variables:",
                missingVars
            )
        }
    }, [])

    return null
}

// Cache clearing component
const CacheManager = () => {
    useEffect(() => {
        // Check if we need to clear cache (e.g., after deployment)
        const lastDeployTime = localStorage.getItem("lastDeployTime")
        const currentTime = Date.now()

        // If no last deploy time or it's been more than 1 hour, clear cache
        if (
            !lastDeployTime ||
            currentTime - parseInt(lastDeployTime) > 3600000
        ) {
            if ("caches" in window) {
                caches.keys().then((names) => {
                    names.forEach((name) => {
                        caches.delete(name)
                    })
                })
            }
            localStorage.setItem("lastDeployTime", currentTime.toString())
        }
    }, [])

    return null
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary>
            <Head>
                <title>PrepYatra - Your Interview Preparation Journey</title>
                <meta
                    name='description'
                    content='Track your interview preparation journey, manage recruiter contacts, and accelerate your career growth with PrepYatra.'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />

                {/* PWA meta tags */}
                <meta name='theme-color' content='#FFCF25' />
                <meta name='apple-mobile-web-app-capable' content='yes' />
                <meta
                    name='apple-mobile-web-app-status-bar-style'
                    content='default'
                />
                <meta name='apple-mobile-web-app-title' content='PrepYatra' />
                <link
                    rel='apple-touch-icon'
                    href='/android-chrome-192x192.png'
                />
                <link rel='manifest' href='/manifest.json' />
            </Head>

            <GoogleOAuthProvider
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                <QueryClientProvider client={queryClient}>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <EnvironmentValidator />
                        <CacheManager />
                        <AuthProvider>
                            <GamificationProvider>
                                <Component {...pageProps} />
                            </GamificationProvider>
                        </AuthProvider>
                    </TooltipProvider>
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </ErrorBoundary>
    )
}
