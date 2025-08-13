import React from "react"
import { Challenge } from "@/types/challenges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Plus,
  Trophy,
  Flame
} from "lucide-react"
import { format } from "date-fns"

interface ChallengeCardProps {
  challenge: Challenge
  onEdit: (challenge: Challenge) => void
  onDelete: (challengeId: string) => void
  onLogProgress: (challenge: Challenge) => void
  onViewDetails: (challenge: Challenge) => void
  onViewProgressHistory: (challenge: Challenge) => void
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onEdit,
  onDelete,
  onLogProgress,
  onViewDetails,
  onViewProgressHistory
}) => {
  const progressPercentage = (challenge.currentDay / challenge.totalDays) * 100
  const daysRemaining = challenge.totalDays - challenge.currentDay
  const isCompleted = challenge.currentDay >= challenge.totalDays

  const getStatusColor = () => {
    if (isCompleted) return "bg-green-600"
    if (progressPercentage >= 70) return "bg-primary"
    if (progressPercentage >= 40) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getStatusText = () => {
    if (isCompleted) return "Completed"
    if (progressPercentage >= 70) return "Almost There"
    if (progressPercentage >= 40) return "In Progress"
    return "Just Started"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 glass-dark border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {challenge.name}
            </CardTitle>
            {challenge.category && (
              <Badge variant="secondary" className="mt-2 bg-secondary/50 text-secondary-foreground border-primary/20">
                {challenge.category}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(challenge)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(challenge._id)}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              Day {challenge.currentDay} of {challenge.totalDays}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} text-white`}>
              {getStatusText()}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Started {format(new Date(challenge.startDate), 'MMM dd')}</span>
          </div>
          
          {!isCompleted && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{daysRemaining} days left</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!isCompleted ? (
            <Button
              onClick={() => onLogProgress(challenge)}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Progress
            </Button>
          ) : (
            <Button
              onClick={() => onViewDetails(challenge)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => onViewDetails(challenge)}
            className="px-4 border-primary/20 text-foreground hover:bg-secondary/50"
          >
            Details
          </Button>
        </div>

        {/* View Logs Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewProgressHistory(challenge)}
          className="w-full text-primary hover:text-primary/80 hover:bg-primary/10"
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Progress History
        </Button>

        {/* Streak Indicator */}
        {challenge.currentDay > 1 && (
          <div className="flex items-center justify-center space-x-2 text-sm text-primary">
            <Flame className="h-4 w-4" />
            <span>Keep the streak going!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ChallengeCard
