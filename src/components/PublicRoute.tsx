import React, { ReactNode } from "react"
import { useLocation } from "react-router-dom"

interface PublicRouteProps {
    children: ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const location = useLocation()

    // For public routes, we don't need any authentication checks
    // Just render the children directly
    return <>{children}</>
}

export default PublicRoute
