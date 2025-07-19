import React, { createContext, useEffect, useState, ReactNode } from "react"
import { useNavigate } from "react-router-dom"

export interface GoogleUser {
    sub: string
    email: string
    name: string
    picture?: string
}

export interface User {
    id: string
    email: string
    name: string
    picture?: string
    provider: string
    providerAccountId: string
}

export interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (googleUser: GoogleUser) => Promise<void>
    signOut: () => Promise<void>
    checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const createUserInWebapp = async (
        googleUser: GoogleUser
    ): Promise<User> => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_TBE_WEBAPP_API_URL}/user`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: googleUser.name || "",
                        email: googleUser.email,
                        image: googleUser.picture || "",
                        provider: "google",
                        providerAccountId: googleUser.sub
                    })
                }
            )

            const data = await res.json()

            if (!data.status) {
                throw new Error(data.message || "Failed to create user")
            }

            return {
                id: data.data._id,
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                provider: "google",
                providerAccountId: googleUser.sub
            }
        } catch (error) {
            console.error("Error creating user in webapp:", error)
            throw error
        }
    }

    const checkUserOnboarding = async (userEmail: string) => {
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/user?email=${userEmail}`
            )
            const data = await res.json()

            if (data?.data?.prepYatra?.pyOnboarded) {
                navigate("/dashboard")
            } // else do nothing, let global logic handle onboarding
        } catch (error) {
            console.error("Error checking user onboarding:", error)
            // Do not navigate to /onboarding on error
        }
    }

    const signIn = async (googleUser: GoogleUser) => {
        try {
            setLoading(true)

            // Create or get user from webapp
            const userData = await createUserInWebapp(googleUser)
            setUser(userData)

            // Store user data in localStorage
            localStorage.setItem("auth_user", JSON.stringify(userData))

            // Check if there's a redirect URL stored
            const redirectUrl = localStorage.getItem("redirectAfterLogin")
            if (redirectUrl) {
                localStorage.removeItem("redirectAfterLogin")
                navigate(redirectUrl)
                return
            }

            // Check onboarding status and navigate accordingly
            await checkUserOnboarding(userData.email)
        } catch (error) {
            console.error("Error signing in:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        try {
            setUser(null)
            // Clear any stored auth data
            localStorage.removeItem("auth_user")
            navigate("/auth")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    const checkAuth = async () => {
        try {
            setLoading(true)

            // Check if user data is stored in localStorage
            const storedUser = localStorage.getItem("auth_user")
            if (storedUser) {
                const userData = JSON.parse(storedUser)
                setUser(userData)

                // Verify with backend
                const res = await fetch(
                    `${import.meta.env.VITE_TBE_WEBAPP_API_URL}/user?email=${
                        userData.email
                    }`
                )
                const data = await res.json()

                if (!data?.data) {
                    // User doesn't exist in backend, clear local data
                    localStorage.removeItem("auth_user")
                    setUser(null)
                }
                // Don't auto-redirect here - let ProtectedRoute handle it
            }
        } catch (error) {
            console.error("Error checking auth:", error)
            localStorage.removeItem("auth_user")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signOut,
        checkAuth
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
