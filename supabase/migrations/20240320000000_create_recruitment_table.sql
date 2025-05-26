-- Create enum for interview status
CREATE TYPE interview_status AS ENUM (
    'Screening',
    'Interviewing',
    'Last Round Pending',
    'Offer Letter',
    'Rejected'
);

-- Create recruitment table
CREATE TABLE recruitment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    interview_status interview_status NOT NULL DEFAULT 'Screening',
    follow_up_date DATE,
    interview_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recruitment_updated_at
    BEFORE UPDATE ON recruitment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 