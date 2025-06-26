-- supabase/migrations/008_extend_user_profiles.sql

-- Add additional profile fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS organization TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add check constraints for gender
ALTER TABLE public.user_profiles 
ADD CONSTRAINT check_gender 
CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Non-binary', 'Prefer not to say'));

-- Add check constraint for years_experience
ALTER TABLE public.user_profiles 
ADD CONSTRAINT check_years_experience 
CHECK (years_experience IS NULL OR years_experience >= 0);

-- Update RLS policies to include new fields
-- (Existing policies should continue to work, but we can be explicit)

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_education ON public.user_profiles(education_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_occupation ON public.user_profiles(occupation);
CREATE INDEX IF NOT EXISTS idx_user_profiles_interests ON public.user_profiles USING gin(interests);
CREATE INDEX IF NOT EXISTS idx_user_profiles_goals ON public.user_profiles USING gin(goals);
