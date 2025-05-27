
import { supabase } from "@/integrations/supabase/client"
import { CreateRecruiterContact, RecruiterContact } from "@/types/recruiters"

export const recruitersService = {
    async create(data: CreateRecruiterContact): Promise<RecruiterContact> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        const { data: recruiter, error } = await supabase
            .from("recruiters")
            .insert([{ ...data, user_id: user.id }])
            .select()
            .single()

        if (error) throw error
        return {
            ...recruiter,
            status: recruiter.status as RecruiterContact["status"]
        }
    },

    async update(id: string, data: Partial<CreateRecruiterContact>): Promise<RecruiterContact> {
        const { data: recruiter, error } = await supabase
            .from("recruiters")
            .update(data)
            .eq("id", id)
            .select()
            .single()

        if (error) throw error
        return {
            ...recruiter,
            status: recruiter.status as RecruiterContact["status"]
        }
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("recruiters")
            .delete()
            .eq("id", id)

        if (error) throw error
    },

    async getById(id: string): Promise<RecruiterContact> {
        const { data: recruiter, error } = await supabase
            .from("recruiters")
            .select()
            .eq("id", id)
            .single()

        if (error) throw error
        return {
            ...recruiter,
            status: recruiter.status as RecruiterContact["status"]
        }
    },

    async getAll(): Promise<RecruiterContact[]> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        const { data: recruiters, error } = await supabase
            .from("recruiters")
            .select()
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

        if (error) throw error
        return (recruiters || []).map(item => ({
            ...item,
            status: item.status as RecruiterContact["status"]
        }))
    },

    async getByStatus(status: RecruiterContact["status"]): Promise<RecruiterContact[]> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        const { data: recruiters, error } = await supabase
            .from("recruiters")
            .select()
            .eq("user_id", user.id)
            .eq("status", status)
            .order("created_at", { ascending: false })

        if (error) throw error
        return (recruiters || []).map(item => ({
            ...item,
            status: item.status as RecruiterContact["status"]
        }))
    }
}
