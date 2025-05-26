import { supabase } from "@/lib/supabase"
import {
    CreateRecruitmentDTO,
    Recruitment,
    UpdateRecruitmentDTO
} from "@/types/recruitment"

export const recruitmentService = {
    async create(data: CreateRecruitmentDTO): Promise<Recruitment> {
        const { data: recruitment, error } = await supabase
            .from("recruitment")
            .insert([data])
            .select()
            .single()

        if (error) throw error
        return recruitment
    },

    async update({ id, ...data }: UpdateRecruitmentDTO): Promise<Recruitment> {
        const { data: recruitment, error } = await supabase
            .from("recruitment")
            .update(data)
            .eq("id", id)
            .select()
            .single()

        if (error) throw error
        return recruitment
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("recruitment")
            .delete()
            .eq("id", id)

        if (error) throw error
    },

    async getById(id: string): Promise<Recruitment> {
        const { data: recruitment, error } = await supabase
            .from("recruitment")
            .select()
            .eq("id", id)
            .single()

        if (error) throw error
        return recruitment
    },

    async getAll(): Promise<Recruitment[]> {
        const { data: recruitments, error } = await supabase
            .from("recruitment")
            .select()
            .order("created_at", { ascending: false })

        if (error) throw error
        return recruitments
    },

    async getByStatus(
        status: Recruitment["interview_status"]
    ): Promise<Recruitment[]> {
        const { data: recruitments, error } = await supabase
            .from("recruitment")
            .select()
            .eq("interview_status", status)
            .order("created_at", { ascending: false })

        if (error) throw error
        return recruitments
    }
}
