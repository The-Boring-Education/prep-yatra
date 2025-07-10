import { useMemo } from "react"
import { usePrepLogs } from "./use-prep-logs"

export interface DailyPrepEncouragementData {
    hasLoggedToday: boolean
    streak: number
    totalLogs: number
    totalTimeSpent: number
    encouragementMessage: string
    encouragementEmoji: string
    buttonText: string
    motivationalTip: string
}

export function useDailyPrepEncouragement(userId: string): DailyPrepEncouragementData {
    const { logs, streak, totalLogs, totalTimeSpent } = usePrepLogs(userId)

    const encouragementData = useMemo(() => {
        // Check if user has logged anything today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const hasLoggedToday = logs.some(log => {
            const logDate = new Date(log.createdAt)
            logDate.setHours(0, 0, 0, 0)
            return logDate.getTime() === today.getTime()
        })

        let encouragementMessage: string
        let encouragementEmoji: string
        let buttonText: string
        let motivationalTip: string

        if (hasLoggedToday) {
            // User has already logged today
            encouragementMessage = streak > 1 
                ? `Amazing! You're on a ${streak}-day streak! 🔥`
                : "Great job logging your prep today! 🎉"
            encouragementEmoji = "✅"
            buttonText = "Add Another Log"
            motivationalTip = "Keep the momentum going! Consider adding another study session."
        } else {
            // User hasn't logged today
            if (streak === 0) {
                // No streak, encourage to start
                encouragementMessage = "Ready to start your prep journey today?"
                encouragementEmoji = "🚀"
                buttonText = "Log Your First Session"
                motivationalTip = "Every expert was once a beginner. Start your journey today!"
            } else if (streak === 1) {
                // Just started streak
                encouragementMessage = "Don't break the chain! Add today's prep log."
                encouragementEmoji = "⏰"
                buttonText = "Continue Your Streak"
                motivationalTip = "Consistency is key. Keep building your daily habit!"
            } else {
                // Has existing streak
                encouragementMessage = `You have a ${streak}-day streak! Don't let it slip away.`
                encouragementEmoji = "🔥"
                buttonText = "Maintain Your Streak"
                motivationalTip = "You're doing great! Each day of preparation brings you closer to your goals."
            }
        }

        return {
            hasLoggedToday,
            streak,
            totalLogs,
            totalTimeSpent,
            encouragementMessage,
            encouragementEmoji,
            buttonText,
            motivationalTip
        }
    }, [logs, streak, totalLogs, totalTimeSpent])

    return encouragementData
}