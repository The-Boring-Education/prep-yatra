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
            refetchOnWindowFocus: false
        }
    }
})

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
                    <p className='text-gray-600 dark:text-gray'>
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

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
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
                        <ChunkErrorBoundary>
                            <CacheManager />
                            <AuthProvider>
                                <GamificationProvider>
                                    <Component {...pageProps} />
                                </GamificationProvider>
                            </AuthProvider>
                        </ChunkErrorBoundary>
                    </TooltipProvider>
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </>
    )
}
