import { 
  Challenge, 
  ChallengeLog, 
  CreateChallengeDTO, 
  UpdateChallengeDTO,
  CreateChallengeLogDTO,
  UpdateChallengeLogDTO,
  ChallengeProgress,
  ChallengeStats
} from "@/types/challenges"

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
  }
}