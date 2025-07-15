import { PrepLog, PrepLogsResponse } from "@/hooks/use-prep-logs"

export const prepLogsService = {
    async getByUserId(userId: string): Promise<PrepLog[]> {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/prepyatra/prep-log?userId=${userId}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: PrepLogsResponse = await response.json()

            if (!result.status) {
                throw new Error("Failed to fetch prep logs")
            }

            return result.data || []
        } catch (error) {
            console.error("Error fetching prep logs:", error)
            throw error
        }
    },

    async create(data: {
        title: string
        description?: string
        timeSpent: number
        userId: string
    }): Promise<PrepLog> {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_TBE_WEBAPP_API_URL}/prepyatra/prep-log`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (!result.status) {
                throw new Error("Failed to create prep log")
            }

            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("prep-stats-refetch"))
            }, 500)

            return result.data
        } catch (error) {
            console.error("Error creating prep log:", error)
            throw error
        }
    },

    async update(data: {
        title?: string
        description?: string
        timeSpent?: number
        prepLogId: string
    }): Promise<PrepLog> {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_TBE_WEBAPP_API_URL}/prepyatra/prep-log`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (!result.status) {
                throw new Error("Failed to update prep log")
            }

            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("prep-stats-refetch"))
            }, 500)

            return result.data
        } catch (error) {
            console.error("Error updating prep log:", error)
            throw error
        }
    },

    async delete(id: string): Promise<void> {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/prepyatra/prep-log?prepLogId=${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (!result.status) {
                throw new Error("Failed to delete prep log")
            }

            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("prep-stats-refetch"))
            }, 500)
        } catch (error) {
            console.error("Error deleting prep log:", error)
            throw error
        }
    }
}
