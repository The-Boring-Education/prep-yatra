import { CreateRecruiterContact, RecruiterContact } from "@/types/recruiters"

const API_BASE_URL = process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL

export const recruitersService = {
    async create(data: CreateRecruiterContact): Promise<RecruiterContact> {
        const response = await fetch(`${API_BASE_URL}/prepyatra/recruiter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()
        if (!result.status) throw new Error(result.message)
        return result.data
    },

    async update(
        id: string,
        data: Partial<CreateRecruiterContact>
    ): Promise<RecruiterContact> {
        const response = await fetch(`${API_BASE_URL}/prepyatra/recruiter`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ recruiterId: id, ...data })
        })

        const result = await response.json()
        if (!result.status) throw new Error(result.message)
        return result.data
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(
            `${API_BASE_URL}/prepyatra/recruiter/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        const result = await response.json()
        if (!result.status) throw new Error(result.message)
    },

    async getById(id: string): Promise<RecruiterContact> {
        const response = await fetch(
            `${API_BASE_URL}/prepyatra/recruiter/${id}`
        )
        const result = await response.json()
        if (!result.status) throw new Error(result.message)
        return result.data
    },

    async getAll(): Promise<RecruiterContact[]> {
        const response = await fetch(`${API_BASE_URL}/prepyatra/recruiter`)
        const result = await response.json()
        if (!result.status) throw new Error(result.message)
        return result.data || []
    },

    async getByStatus(
        status: RecruiterContact["applicationStatus"]
    ): Promise<RecruiterContact[]> {
        const response = await fetch(
            `${API_BASE_URL}/prepyatra/recruiter?status=${status}`
        )
        const result = await response.json()
        if (!result.status) throw new Error(result.message)
        return result.data || []
    }
}
