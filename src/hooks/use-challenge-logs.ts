import { useState, useEffect, useCallback } from "react"
import { ChallengeLog, CreateChallengeLogDTO, UpdateChallengeLogDTO } from "@/types/challenges"
import { challengesService } from "@/services/challenges"
import { toast } from "sonner"

export const useChallengeLogs = (challengeId: string) => {
  const [logs, setLogs] = useState<ChallengeLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch logs for a specific challenge
  const fetchLogs = useCallback(async () => {
    if (!challengeId) return

    setLoading(true)
    setError(null)

    try {
      const data = await challengesService.getLogsByChallengeId(challengeId)
      setLogs(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch challenge logs"
      setError(errorMessage)
      toast.error("Failed to fetch challenge logs")
    } finally {
      setLoading(false)
    }
  }, [challengeId])

  // Add a new log entry
  const addLog = useCallback(async (logData: CreateChallengeLogDTO) => {
    setLoading(true)
    setError(null)

    try {
      const newLog = await challengesService.addLog(logData)
      setLogs(prev => [newLog, ...prev])
      toast.success("Progress logged successfully!")
      return newLog
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to log progress"
      setError(errorMessage)
      toast.error("Failed to log progress")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update an existing log entry
  const updateLog = useCallback(async (logId: string, updateData: UpdateChallengeLogDTO) => {
    setLoading(true)
    setError(null)

    try {
      const updatedLog = await challengesService.updateLog(challengeId, logId, updateData)
      setLogs(prev => 
        prev.map(log => 
          log._id === logId ? updatedLog : log
        )
      )
      toast.success("Progress updated successfully!")
      return updatedLog
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update progress"
      setError(errorMessage)
      toast.error("Failed to update progress")
      throw err
    } finally {
      setLoading(false)
    }
  }, [challengeId])

  // Get log for a specific day
  const getLogByDay = useCallback((day: number) => {
    return logs.find(log => log.day === day)
  }, [logs])

  // Check if a day has been logged
  const isDayLogged = useCallback((day: number) => {
    return logs.some(log => log.day === day)
  }, [logs])

  // Get the next day to log
  const getNextDayToLog = useCallback(() => {
    if (logs.length === 0) return 1
    
    const loggedDays = logs.map(log => log.day).sort((a, b) => b - a)
    return loggedDays[0] + 1
  }, [logs])

  // Get total hours logged
  const getTotalHoursLogged = useCallback(() => {
    return logs.reduce((total, log) => total + log.hoursSpent, 0)
  }, [logs])

  // Get current streak
  const getCurrentStreak = useCallback(() => {
    if (logs.length === 0) return 0

    const sortedLogs = logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    let streak = 0
    let currentDate = new Date()

    for (const log of sortedLogs) {
      const logDate = new Date(log.createdAt)
      const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= 1) {
        streak++
        currentDate = logDate
      } else {
        break
      }
    }

    return streak
  }, [logs])

  // Refresh logs
  const refreshLogs = useCallback(() => {
    fetchLogs()
  }, [fetchLogs])

  // Initialize logs on mount
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return {
    logs,
    loading,
    error,
    addLog,
    updateLog,
    getLogByDay,
    isDayLogged,
    getNextDayToLog,
    getTotalHoursLogged,
    getCurrentStreak,
    refreshLogs,
    fetchLogs
  }
}
