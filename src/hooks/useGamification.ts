import { useState, useEffect, useCallback } from "react"

export interface GamificationAction {
    actionType: string
    pointsEarned: number
    createdAt: string
}

export interface GamificationData {
    points: number
    actions: GamificationAction[]
}

export interface GamificationLevel {
    level: number
    name: string
    minPoints: number
    maxPoints: number
}

const LEVELS: GamificationLevel[] = [
    { level: 1, name: "Beginner", minPoints: 0, maxPoints: 49 },
    { level: 2, name: "Explorer", minPoints: 50, maxPoints: 149 },
    { level: 3, name: "Learner", minPoints: 150, maxPoints: 299 },
    { level: 4, name: "Achiever", minPoints: 300, maxPoints: 599 },
    { level: 5, name: "Master", minPoints: 600, maxPoints: 999 },
    { level: 6, name: "Legend", minPoints: 1000, maxPoints: Infinity }
]

export function useGamification(userId?: string) {
    const [data, setData] = useState<{ points: number; actions: unknown[] } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch gamification data from backend
    const fetchGamificationData = useCallback(async () => {
        if (!userId) return
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${import.meta.env.VITE_TBE_WEBAPP_API_URL}/api/v1/gamification?userId=${userId}`)
            const result = await res.json()
            if (!result.success) throw new Error(result.message || "Failed to fetch gamification data")
            setData(result.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch gamification data")
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchGamificationData()
        // Listen for global refetch event
        const handleRefetch = () => fetchGamificationData()
        window.addEventListener("gamification-refetch", handleRefetch)
        return () => window.removeEventListener("gamification-refetch", handleRefetch)
    }, [fetchGamificationData])

    // Calculate current level based on points
    const getCurrentLevel = (): GamificationLevel => {
        if (!data?.points) return LEVELS[0]
        
        return LEVELS.find(level => 
            data.points >= level.minPoints && data.points <= level.maxPoints
        ) || LEVELS[0]
    }

    // Calculate progress to next level
    const getProgressToNextLevel = () => {
        if (!data?.points) return 0
        
        const currentLevel = getCurrentLevel()
        const pointsInCurrentLevel = data.points - currentLevel.minPoints
        const pointsNeededForLevel = currentLevel.maxPoints - currentLevel.minPoints
        
        return Math.min((pointsInCurrentLevel / pointsNeededForLevel) * 100, 100)
    }

    // Get next level info
    const getNextLevel = (): GamificationLevel | null => {
        const currentLevel = getCurrentLevel()
        const nextLevelIndex = LEVELS.findIndex(level => level.level === currentLevel.level + 1)
        return nextLevelIndex >= 0 ? LEVELS[nextLevelIndex] : null
    }

    // Get points needed for next level
    const getPointsNeededForNextLevel = (): number => {
        const nextLevel = getNextLevel()
        if (!nextLevel || !data?.points) return 0
        return nextLevel.minPoints - data.points
    }

    const currentLevel = getCurrentLevel()
    const nextLevel = getNextLevel()
    const progressToNextLevel = getProgressToNextLevel()
    const pointsNeededForNextLevel = getPointsNeededForNextLevel()

    return {
        points: data?.points || 0,
        actions: data?.actions || [],
        loading,
        error,
        refetch: fetchGamificationData,
        currentLevel: currentLevel.level,
        currentLevelName: currentLevel.name,
        nextLevel: nextLevel?.level || null,
        nextLevelName: nextLevel?.name || null,
        percentageProgress: progressToNextLevel,
        pointsNeededForNextLevel,
    }
} 