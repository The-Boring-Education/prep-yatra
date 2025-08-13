import {
  Challenge,
  ChallengeLog,
  CreateChallengeDTO,
  UpdateChallengeDTO,
  CreateChallengeLogDTO,
  UpdateChallengeLogDTO,
  ChallengeProgress,
  ChallengeStats,
  SocialMediaTemplate
} from "@/types/challenges"
import { trackEvent } from '@/lib/analytics'

// FIXED: Point to your EXTERNAL API project, not local routes
const BASE_URL = `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenges`

export const challengesService = {
  // Challenge Management
  async create(data: CreateChallengeDTO): Promise<Challenge> {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to create challenge")
      }

          // Analytics
      try {
        trackEvent('challenge_create', {
          category: 'challenge',
          value: data.totalDays,
          challengeName: data.name
        });
      } catch {}

      return result.data
    } catch (error) {
      console.error("Error creating challenge:", error)
      throw error
    }
  },

  async getByUserId(userId: string): Promise<Challenge[]> {
    try {
      const response = await fetch(`${BASE_URL}?userId=${userId}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to fetch challenges")
      }

      return result.data || []
    } catch (error) {
      console.error("Error fetching challenges:", error)
      throw error
    }
  },

  async getById(challengeId: string): Promise<Challenge> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to fetch challenge")
      }

      return result.data
    } catch (error) {
      console.error("Error fetching challenge:", error)
      throw error
    }
  },

  async update(challengeId: string, data: UpdateChallengeDTO): Promise<Challenge> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to update challenge")
      }

      // Analytics
      try {
        trackEvent('challenge_update', {
          category: 'challenge',
          challengeId: challengeId,
          updatedFields: Object.keys(data)
        });
      } catch {}

      return result.data
    } catch (error) {
      console.error("Error updating challenge:", error)
      throw error
    }
  },

  async delete(challengeId: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to delete challenge")
      }

      // Analytics
      try {
        trackEvent('challenge_delete', {
          category: 'challenge',
          challengeId
        });
      } catch {}
    } catch (error) {
      console.error("Error deleting challenge:", error)
      throw error
    }
  },

  // Challenge Logs
  async addLog(challengeId: string, data: CreateChallengeLogDTO): Promise<ChallengeLog> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to add log")
      }

      // Trigger prep-stats refetch for gamification
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('prep-stats-refetch'));
      }, 500);

      // Analytics
      try {
        trackEvent('challenge_log_create', {
          category: 'challenge_log',
          value: data.hoursSpent,
          challengeId: challengeId
        });
      } catch {}

      return result.data
    } catch (error) {
      console.error("Error adding log:", error)
      throw error
    }
  },

  async getLogsByChallengeId(challengeId: string): Promise<ChallengeLog[]> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}/logs`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to fetch logs")
      }

      return result.data || []
    } catch (error) {
      console.error("Error fetching logs:", error)
      throw error
    }
  },

  async updateLog(challengeId: string, logId: string, data: UpdateChallengeLogDTO): Promise<ChallengeLog> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}/logs/${logId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to update log")
      }

      return result.data
    } catch (error) {
      console.error("Error updating log:", error)
      throw error
    }
  },

  async deleteLog(challengeId: string, logId: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}/logs/${logId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to delete log")
      }
    } catch (error) {
      console.error("Error deleting log:", error)
      throw error
    }
  },

  // Progress and Stats
  async getProgress(challengeId: string): Promise<ChallengeProgress> {
    try {
      const response = await fetch(`${BASE_URL}/${challengeId}/progress`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to fetch progress")
      }

      return result.data
    } catch (error) {
      console.error("Error fetching progress:", error)
      throw error
    }
  },

  async getStats(userId: string): Promise<ChallengeStats> {
    try {
      const response = await fetch(`${BASE_URL}/stats/${userId}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error("Failed to fetch stats")
      }

      return result.data
    } catch (error) {
      console.error("Error fetching stats:", error)
      throw error
    }
  },

  // Generate social media template
  generateSocialMediaTemplate(challenge: Challenge, currentLog: ChallengeLog, nextGoals: string[] = []): SocialMediaTemplate {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prepyatra.com';
    
    return {
      challengeName: challenge.name,
      currentDay: currentLog.day,
      progressText: currentLog.progressText,
      nextGoals: nextGoals.length > 0 ? nextGoals : ['Continue learning consistently', 'Apply new concepts in practice'],
      appUrl
    };
  },

  // Format social media message
  formatSocialMediaMessage(template: SocialMediaTemplate): string {
    const goals = template.nextGoals.map((goal, index) => `${index + 1}. ${goal}`).join('\n');
    
    return `Today was Day ${template.currentDay} of ${template.challengeName}

I worked on - 
${template.progressText}

My next goal is - 
${goals}

---
Learning it on Prep Yatra. Visit ${template.appUrl} to create your challenge.`;
  }
}
