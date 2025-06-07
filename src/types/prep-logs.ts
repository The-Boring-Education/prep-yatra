export type PrepLog = {
    id: string
    user_id: string
    log_date: string // ISO date string, e.g., 'YYYY-MM-DD'
    logs: string[]
    hours_in_minutes: number
    created_at: string // ISO timestamp string
    updated_at: string // ISO timestamp string
}

export type CreatePrepLogDto = {
    log_date: string
    logs: string[]
    hours_in_minutes: number
}

export type UpdatePrepLogDto = {
    log_date?: string
    logs?: string[]
    hours_in_minutes?: number
}
