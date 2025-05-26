export interface RecruiterContact {
    id: string
    user_id: string
    name: string
    company?: string
    email?: string
    phone?: string
    notes?: string
    status:
        | "Screening"
        | "Interviewing"
        | "Last Round Pending"
        | "Offer Letter"
        | "Rejected"
    follow_up_date?: string
    interview_date?: string
    created_at: string
    updated_at: string
}

export interface CreateRecruiterContact {
    name: string
    company: string
    email: string
    phone?: string
    position: string
    status:
        | "Screening"
        | "Interviewing"
        | "Last Round Pending"
        | "Offer Letter"
        | "Rejected"
    follow_up_date?: string
    interview_date?: string
    notes?: string
}
