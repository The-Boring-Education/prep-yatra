import { useState, useEffect, useCallback } from "react"
import { Challenge, CreateChallengeDTO, UpdateChallengeDTO } from "@/types/challenges"
import { challengesService } from "@/services/challenges"
import { toast } from "sonner"

export const useChallenges = (userId: string) => {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch challenges for a user
  const fetchChallenges = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const data = await challengesService.getByUserId(userId)
      setChallenges(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch challenges"
      setError(errorMessage)
      toast.error("Failed to fetch challenges")
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Create a new challenge
  const createChallenge = useCallback(async (challengeData: CreateChallengeDTO) => {
    setLoading(true)
    setError(null)

    try {
      const newChallenge = await challengesService.create(challengeData)
      setChallenges(prev => [newChallenge, ...prev])
      toast.success("Challenge created successfully!")
      return newChallenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create challenge"
      setError(errorMessage)
      toast.error("Failed to create challenge")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update an existing challenge
  const updateChallenge = useCallback(async (challengeId: string, updateData: UpdateChallengeDTO) => {
    setLoading(true)
    setError(null)

    try {
      const updatedChallenge = await challengesService.update(challengeId, updateData)
      setChallenges(prev => 
        prev.map(challenge => 
          challenge._id === challengeId ? updatedChallenge : challenge
        )
      )
      toast.success("Challenge updated successfully!")
      return updatedChallenge
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update challenge"
      setError(errorMessage)
      toast.error("Failed to update challenge")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete a challenge
  const deleteChallenge = useCallback(async (challengeId: string) => {
    setLoading(true)
    setError(null)

    try {
      await challengesService.delete(challengeId)
      setChallenges(prev => prev.filter(challenge => challenge._id !== challengeId))
      toast.success("Challenge deleted successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete challenge"
      setError(errorMessage)
      toast.error("Failed to delete challenge")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get a specific challenge by ID
  const getChallengeById = useCallback(async (challengeId: string) => {
    try {
      return await challengesService.getById(challengeId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch challenge"
      setError(errorMessage)
      toast.error("Failed to fetch challenge")
      throw err
    }
  }, [])

  // Refresh challenges
  const refreshChallenges = useCallback(() => {
    fetchChallenges()
  }, [fetchChallenges])

  // Initialize challenges on mount
  useEffect(() => {
    fetchChallenges()
  }, [fetchChallenges])

  // Calculate statistics
  const activeChallenges = challenges.filter(challenge => challenge.isActive);
  const completedChallenges = challenges.filter(challenge => !challenge.isActive);
  const totalChallenges = challenges.length;

  // Get current active challenge (most recent)
  const currentChallenge = activeChallenges.length > 0 
    ? activeChallenges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  // Calculate total days across all challenges
  const totalDaysCommitted = challenges.reduce(
    (acc, challenge) => acc + challenge.totalDays,
    0
  );

  // Calculate completion rate
  const completionRate = totalChallenges > 0 
    ? Math.round((completedChallenges.length / totalChallenges) * 100)
    : 0;

  // Get recent challenges (last 30 days)
  const getRecentChallenges = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return challenges.filter(
      (challenge) => new Date(challenge.createdAt) >= thirtyDaysAgo
    );
  };

  const recentChallenges = getRecentChallenges();

  return {
    challenges,
    loading,
    error,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getChallengeById,
    refreshChallenges,
    fetchChallenges,
    // Additional statistics
    activeChallenges,
    completedChallenges,
    currentChallenge,
    totalChallenges,
    totalDaysCommitted,
    completionRate,
    recentChallenges
  }
}
