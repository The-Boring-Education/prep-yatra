
export interface RecruiterContact {
    id: string
    user_id: string
    name: string
    company?: string
    email?: string
    phone?: string
    status?: "Screening in Process" | "Interviewing" | "Final Round Offer" | "Offer Letter" | "Rejected"
    follow_up_date?: string
    last_interview_date?: string
    link?: string
    comments?: string
    created_at: string
}

export interface CreateRecruiterContact {
    name: string
    company?: string
    email?: string
    phone?: string
    status?: "Screening in Process" | "Interviewing" | "Final Round Offer" | "Offer Letter" | "Rejected"
    follow_up_date?: string
    last_interview_date?: string
    link?: string
    comments?: string
}
