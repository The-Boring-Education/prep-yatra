import React, { useState } from "react"
import { Challenge, ChallengeTemplate } from "@/types/challenges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Trophy, TrendingUp, Flame, ArrowLeft } from "lucide-react"
import ChallengeCard from "./ChallengeCard"
import CreateChallengeModal from "./CreateChallengeModal"
import ChallengeLogModal from "./ChallengeLogModal"
import SocialShareModal from "./SocialShareModal"
import ChallengeLogsList from "./ChallengeLogsList"
import { useChallenges } from "@/hooks/use-challenges"
import { useChallengeLogs } from "@/hooks/use-challenge-logs"
import { CreateChallengeDTO, UpdateChallengeDTO, CreateChallengeLogDTO, UpdateChallengeLogDTO } from "@/types/challenges"
import { challengesService } from "@/services/challenges"
import { toast } from "sonner"

interface ChallengesShowcaseProps {
  userId: string
}

const ChallengesShowcase: React.FC<ChallengesShowcaseProps> = ({ userId }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [editChallenge, setEditChallenge] = useState<Challenge | null>(null)
  const [viewingProgressHistory, setViewingProgressHistory] = useState<Challenge | null>(null)

  const { 
    challenges, 
    loading, 
    createChallenge, 
    updateChallenge, 
    deleteChallenge,
    refreshChallenges
  } = useChallenges(userId)

  const handleCreateChallenge = async (data: CreateChallengeDTO) => {
    try {
      await createChallenge(data)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("Failed to create challenge:", error)
    }
  }

  const handleUpdateChallenge = async (data: UpdateChallengeDTO) => {
    if (!editChallenge) return
    
    try {
      await updateChallenge(editChallenge._id, data)
      setEditChallenge(null)
    } catch (error) {
      console.error("Failed to update challenge:", error)
    }
  }

  const handleDeleteChallenge = async (challengeId: string) => {
    if (window.confirm("Are you sure you want to delete this challenge? This action cannot be undone.")) {
      try {
        await deleteChallenge(challengeId)
      } catch (error) {
        console.error("Failed to delete challenge:", error)
      }
    }
  }

  const handleLogProgress = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setIsLogModalOpen(true)
  }

  const handleViewDetails = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    // You can implement a detailed view modal here
    console.log("View details for:", challenge)
  }

  const handleViewProgressHistory = (challenge: Challenge) => {
    setViewingProgressHistory(challenge)
  }

  const handleEditChallenge = (challenge: Challenge) => {
    setEditChallenge(challenge)
    setIsCreateModalOpen(true)
  }

  const handleLogSubmit = async (data: CreateChallengeLogDTO | UpdateChallengeLogDTO) => {
    if (!selectedChallenge) return

    try {
      // The data from the modal already has the correct structure
      // Just call the API to log the progress
      const newLog = await challengesService.addLog(selectedChallenge._id, data as CreateChallengeLogDTO)
      
      // Update the challenge's current day
      await updateChallenge(selectedChallenge._id, {
        currentDay: selectedChallenge.currentDay + 1
      })
      
      setSelectedLog(newLog)
      setIsLogModalOpen(false)
      setIsSocialShareModalOpen(true)
      
      toast.success("Progress logged successfully! 🎉")
    } catch (error) {
      console.error("Failed to log progress:", error)
      toast.error("Failed to log progress. Please try again.")
    }
  }

  const handleSocialShare = (log: any) => {
    setSelectedLog(log)
    setIsSocialShareModalOpen(true)
  }

  const getStats = () => {
    const totalChallenges = challenges.length
    const activeChallenges = challenges.filter(c => c.isActive && c.currentDay < c.totalDays).length
    const completedChallenges = challenges.filter(c => c.currentDay >= c.totalDays).length
    const totalHours = challenges.reduce((sum, c) => sum + (c.currentDay || 0), 0)

    return { totalChallenges, activeChallenges, completedChallenges, totalHours }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show progress history view if a challenge is selected
  if (viewingProgressHistory) {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setViewingProgressHistory(null)}
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {viewingProgressHistory.name}
            </h2>
            <p className="text-muted-foreground">
              Track your daily progress and learning journey
            </p>
          </div>
        </div>

        {/* Progress History */}
        <ChallengeLogsList 
          challenge={viewingProgressHistory}
          onLogUpdated={() => {
            // Refresh challenges to update progress
            refreshChallenges()
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Learning Challenges
          </h2>
          <p className="text-muted-foreground">
            Track your progress and stay motivated with structured learning challenges
          </p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-dark border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {stats.totalChallenges}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {stats.activeChallenges}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {stats.completedChallenges}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {stats.totalHours}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <Card className="text-center py-12 glass-dark border-primary/20">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-secondary/50 rounded-full flex items-center justify-center border border-primary/20">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No challenges yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by creating your first challenge
                </p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Challenge
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              onEdit={handleEditChallenge}
              onDelete={handleDeleteChallenge}
              onLogProgress={handleLogProgress}
              onViewDetails={handleViewDetails}
              onViewProgressHistory={handleViewProgressHistory}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditChallenge(null)
        }}
        onSubmit={editChallenge ? handleUpdateChallenge : handleCreateChallenge}
        editChallenge={editChallenge}
        userId={userId} 
      />

      {selectedChallenge && (
        <ChallengeLogModal
          isOpen={isLogModalOpen}
          onClose={() => {
            setIsLogModalOpen(false)
            setSelectedChallenge(null)
          }}
          onSubmit={handleLogSubmit}
          challenge={selectedChallenge}
          onSocialShare={handleSocialShare}
        />
      )}

      {selectedLog && selectedChallenge && (
        <SocialShareModal
          isOpen={isSocialShareModalOpen}
          onClose={() => {
            setIsSocialShareModalOpen(false)
            setSelectedLog(null)
            setSelectedChallenge(null)
          }}
          challenge={selectedChallenge}
          log={selectedLog}
        />
      )}
    </div>
  )
}

export default ChallengesShowcase
