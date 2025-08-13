import React, { useState, useEffect } from "react"
import { Challenge, ChallengeLog } from "@/types/challenges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { challengesService } from "@/services/challenges"
import { toast } from "sonner"

interface ChallengeLogsListProps {
  challenge: Challenge
  onLogUpdated?: () => void
}

const ChallengeLogsList: React.FC<ChallengeLogsListProps> = ({ 
  challenge, 
  onLogUpdated 
}) => {
  const [logs, setLogs] = useState<ChallengeLog[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [challenge._id])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const challengeLogs = await challengesService.getLogsByChallengeId(challenge._id)
      setLogs(challengeLogs)
    } catch (error) {
      console.error("Failed to fetch logs:", error)
      toast.error("Failed to fetch progress logs")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLog = async (logId: string) => {
    if (!window.confirm("Are you sure you want to delete this progress log?")) {
      return
    }

    try {
      await challengesService.deleteLog(challenge._id, logId)
      toast.success("Progress log deleted")
      fetchLogs()
      onLogUpdated?.()
    } catch (error) {
      console.error("Failed to delete log:", error)
      toast.error("Failed to delete progress log")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <Card className="text-center py-8 glass-dark border-primary/20">
        <CardContent>
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-secondary/50 rounded-full flex items-center justify-center border border-primary/20">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No progress logs yet
              </h3>
              <p className="text-muted-foreground">
                Start logging your daily progress to track your journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Progress History
        </h3>
        <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground border-primary/20">
          {logs.length} entries
        </Badge>
      </div>

      <div className="space-y-3">
        {logs
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((log) => (
            <Card key={log._id} className="glass-dark border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        Day {log.day}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <CardTitle className="text-base font-medium text-foreground">
                      {log.progressText}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLog(log._id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{log.hoursSpent} hours</span>
                  </div>
                </div>

                {log.nextGoals.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Next Goals:</p>
                    <div className="flex flex-wrap gap-2">
                      {log.nextGoals.map((goal, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-secondary/30 text-secondary-foreground border-primary/20"
                        >
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

export default ChallengeLogsList
