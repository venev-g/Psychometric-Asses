-- Enable RLS on all public tables to fix security issues
-- This migration addresses the security warnings from Supabase advisors

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reference tables (test_types, questions, test_sequences)
-- These are configuration data that should be readable by all authenticated users

CREATE POLICY "test_types_read_policy" ON public.test_types
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "questions_read_policy" ON public.questions
  FOR SELECT  
  TO authenticated
  USING (is_active = true);

CREATE POLICY "test_sequences_read_policy" ON public.test_sequences
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "test_configurations_read_policy" ON public.test_configurations
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Service role should have full access to all tables
CREATE POLICY "service_role_all_access_user_profiles" ON public.user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_test_configurations" ON public.test_configurations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_test_types" ON public.test_types
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_test_sequences" ON public.test_sequences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_questions" ON public.questions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_assessment_sessions" ON public.assessment_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_user_responses" ON public.user_responses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_assessment_results" ON public.assessment_results
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
