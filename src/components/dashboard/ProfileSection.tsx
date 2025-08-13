import React from "react"
import { ExternalLink, Github, Linkedin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Profile {
    name?: string
    username?: string
    linkedInUrl?: string
    githubUrl?: string
    leetCodeUrl?: string
    prepYatra?: {
        experienceLevel?: string
        goal?: string
    }
    createdAt?: string
}

interface User {
    name?: string
    picture?: string
}

interface ProfileSectionProps {
    user?: User
    profile?: Profile
}

const withProtocol = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`
    }
    return url
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, profile }) => {
    return (
        <Card className="mb-6">
            <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user?.picture} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                        {getInitials(user?.name || "")}
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">
                    {profile?.name || user?.name}
                </CardTitle>
                <CardDescription>
                    @{profile?.username || user?.name?.toLowerCase()}
                </CardDescription>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 mt-4">
                    {profile?.linkedInUrl && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50"
                            asChild
                        >
                            <a
                                href={withProtocol(profile.linkedInUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin className="w-4 h-4 text-white" />
                            </a>
                        </Button>
                    )}
                    {profile?.githubUrl && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50"
                            asChild
                        >
                            <a
                                href={withProtocol(profile.githubUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="w-4 h-4 text-white" />
                            </a>
                        </Button>
                    )}
                    {profile?.leetCodeUrl && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50"
                            asChild
                        >
                            <a
                                href={withProtocol(profile.leetCodeUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="w-4 h-4 text-white" />
                            </a>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Experience:</span>
                        <Badge variant="secondary">
                            {profile?.prepYatra?.experienceLevel || "Not set"}
                        </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Goal:</span>
                        <Badge variant="outline">
                            {profile?.prepYatra?.goal || "Not set"}
                        </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Joined:</span>
                        <span>
                            {profile?.createdAt 
                                ? new Date(profile.createdAt).toLocaleDateString()
                                : "Unknown"
                            }
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProfileSection