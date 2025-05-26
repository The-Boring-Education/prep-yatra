
export interface RecruiterContact {
  id: string;
  user_id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  notes?: string;
  status: 'active' | 'follow_up' | 'interview_scheduled' | 'closed';
  last_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRecruiterContact {
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  notes?: string;
  status: 'active' | 'follow_up' | 'interview_scheduled' | 'closed';
}
