-- supabase/migrations/007_add_email_to_user_profiles.sql

-- Add email column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN email TEXT;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
