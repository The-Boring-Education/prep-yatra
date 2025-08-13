import React, { useState, useEffect } from "react"
import { Challenge, ChallengeLog, CreateChallengeLogDTO, UpdateChallengeLogDTO } from "@/types/challenges"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, X, Calendar, Clock } from "lucide-react"

interface ChallengeLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateChallengeLogDTO | UpdateChallengeLogDTO) => Promise<void>
  challenge: Challenge
  editLog?: ChallengeLog | null
  onSocialShare?: (log: ChallengeLog) => void
}

const ChallengeLogModal: React.FC<ChallengeLogModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  challenge,
  editLog,
  onSocialShare
}) => {
  const [formData, setFormData] = useState({
    progressText: "",
    hoursSpent: "",
    nextGoals: [""]
  })
  const [loading, setLoading] = useState(false)

  // Initialize form data when editing
  useEffect(() => {
    if (editLog) {
      setFormData({
        progressText: editLog.progressText,
        hoursSpent: editLog.hoursSpent.toString(),
        nextGoals: editLog.nextGoals.length > 0 ? editLog.nextGoals : [""]
      })
    } else {
      setFormData({
        progressText: "",
        hoursSpent: "",
        nextGoals: [""]
      })
    }
  }, [editLog, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextGoalChange = (index: number, value: string) => {
    const newNextGoals = [...formData.nextGoals]
    newNextGoals[index] = value
    setFormData(prev => ({ ...prev, nextGoals: newNextGoals }))
  }

  const addNextGoal = () => {
    setFormData(prev => ({ ...prev, nextGoals: [...prev.nextGoals, ""] }))
  }

  const removeNextGoal = (index: number) => {
    if (formData.nextGoals.length > 1) {
      const newNextGoals = formData.nextGoals.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, nextGoals: newNextGoals }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.progressText.trim() || !formData.hoursSpent) {
      toast.error("Please fill in all required fields")
      return
    }

    const hoursSpent = parseFloat(formData.hoursSpent)
    if (hoursSpent <= 0 || hoursSpent > 24) {
      toast.error("Hours spent must be between 0.1 and 24")
      return
    }

    // Filter out empty next goals
    const filteredNextGoals = formData.nextGoals.filter(goal => goal.trim() !== "")

    setLoading(true)

    try {
      const submitData = {
        challengeId: challenge._id,
        userId: challenge.userId,
        day: getCurrentDay(),
        progressText: formData.progressText.trim(),
        hoursSpent,
        nextGoals: filteredNextGoals
      }

      await onSubmit(submitData)
      
      // Show success message and social share prompt
      toast.success("Progress logged successfully! 🎉")
      
      // If this is a new log and social share is available, prompt user
      if (!editLog && onSocialShare) {
        setTimeout(() => {
          toast.info("Share your progress on social media!", {
            action: {
              label: "Share Now",
              onClick: () => {
                // This would be handled by the parent component
                onClose()
              }
            }
          })
        }, 1000)
      }
      
      onClose()
    } catch (error) {
      console.error("Error submitting log:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      progressText: "",
      hoursSpent: "",
      nextGoals: [""]
    })
  }

  const getCurrentDay = () => {
    if (editLog) return editLog.day
    // Calculate next day to log
    return challenge.currentDay + 1
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editLog ? "Edit Progress" : "Log Daily Progress"}
          </DialogTitle>
          <DialogDescription>
            {editLog 
              ? `Update your progress for Day ${editLog.day}` 
              : `Log your progress for Day ${getCurrentDay()} of ${challenge.name}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Challenge Info */}
          <div className="bg-secondary/30 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">
                {challenge.name}
              </h3>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Day {getCurrentDay()} of {challenge.totalDays}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Started {new Date(challenge.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{challenge.totalDays - getCurrentDay()} days remaining</span>
              </div>
            </div>
          </div>

          {/* Progress Text */}
          <div className="space-y-2">
            <Label htmlFor="progressText">
              What did you work on today? *
            </Label>
            <Textarea
              id="progressText"
              value={formData.progressText}
              onChange={(e) => handleInputChange("progressText", e.target.value)}
              placeholder="Describe what you learned, practiced, or accomplished today..."
              rows={4}
              required
            />
          </div>

          {/* Hours Spent */}
          <div className="space-y-2">
            <Label htmlFor="hoursSpent">
              How many hours did you spend? *
            </Label>
            <Input
              id="hoursSpent"
              type="number"
              step="0.1"
              min="0.1"
              max="24"
              value={formData.hoursSpent}
              onChange={(e) => handleInputChange("hoursSpent", e.target.value)}
              placeholder="e.g., 2.5"
              required
            />
            <p className="text-xs text-gray-500">
              Enter time in hours (0.1 to 24 hours)
            </p>
          </div>

          {/* Next Goals */}
          <div className="space-y-3">
            <Label>What are your goals for tomorrow?</Label>
            <div className="space-y-2">
              {formData.nextGoals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={goal}
                    onChange={(e) => handleNextGoalChange(index, e.target.value)}
                    placeholder={`Goal ${index + 1}...`}
                  />
                  {formData.nextGoals.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNextGoal(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNextGoal}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Goal
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Set 1-3 specific goals for your next session
            </p>
          </div>

          {/* Tips */}
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            <p className="text-sm text-primary">
              💡 <strong>Tip:</strong> Be specific about what you accomplished and what you'll work on next. 
              This helps track your progress and stay motivated!
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editLog ? "Update Progress" : "Log Progress"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChallengeLogModal
