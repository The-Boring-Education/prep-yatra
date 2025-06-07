import { supabase } from "../lib/supabase"
import { CreatePrepLogDto, PrepLog, UpdatePrepLogDto } from "../types/prep-logs"

export const getPrepLogs = async (
    userId: string
): Promise<PrepLog[] | null> => {
    const { data, error } = await supabase
        .from("prep_logs")
        .select("*")
        .eq("user_id", userId)
        .order("log_date", { ascending: false })

    if (error) {
        console.error("Error fetching prep logs:", error)
        return null
    }

    return data as PrepLog[]
}

export const addPrepLog = async (
    userId: string,
    log: CreatePrepLogDto
): Promise<PrepLog | null> => {
    const { data, error } = await supabase
        .from("prep_logs")
        .insert({ ...log, user_id: userId })
        .select()
        .single()

    if (error) {
        console.error("Error adding prep log:", error)
        return null
    }

    return data as PrepLog
}

export const updatePrepLog = async (
    id: string,
    log: UpdatePrepLogDto
): Promise<PrepLog | null> => {
    const { data, error } = await supabase
        .from("prep_logs")
        .update(log)
        .eq("id", id)
        .select()
        .single()

    if (error) {
        console.error("Error updating prep log:", error)
        return null
    }

    return data as PrepLog
}

export const deletePrepLog = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("prep_logs").delete().eq("id", id)

    if (error) {
        console.error("Error deleting prep log:", error)
        return false
    }

    return true
}
