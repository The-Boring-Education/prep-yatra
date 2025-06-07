-- Create prep_logs table
CREATE TABLE public.prep_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    log_date date NOT NULL,
    logs text[] NOT NULL,
    hours_in_minutes integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,

    UNIQUE (user_id, log_date) -- Ensure only one log per user per day
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.prep_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own prep logs" ON public.prep_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prep logs" ON public.prep_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prep logs" ON public.prep_logs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prep logs" ON public.prep_logs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
