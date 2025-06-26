-- Fix RLS policies to reference correct table names
-- Migration to fix the table name mismatch in RLS policies

-- First, drop all existing policies that reference the wrong table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can manage test configurations" ON test_configurations;
DROP POLICY IF EXISTS "Admins can manage test types" ON test_types;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
DROP POLICY IF EXISTS "Admins can manage question options" ON question_options;
DROP POLICY IF EXISTS "Admins can view all assessment sessions" ON assessment_sessions;
DROP POLICY IF EXISTS "Admins can manage assessment sessions" ON assessment_sessions;
DROP POLICY IF EXISTS "Admins can view all user responses" ON user_responses;
DROP POLICY IF EXISTS "Admins can manage user responses" ON user_responses;
DROP POLICY IF EXISTS "Admins can view all assessment results" ON assessment_results;
DROP POLICY IF EXISTS "Admins can manage assessment results" ON assessment_results;

-- Disable RLS on users table if it exists (it shouldn't)
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- Enable RLS on the correct table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create correct policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test configurations policies (corrected)
CREATE POLICY "Admins can manage test configurations" ON test_configurations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test types policies (corrected)
CREATE POLICY "Admins can manage test types" ON test_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Questions policies (corrected)
CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Question options policies (corrected)
CREATE POLICY "Admins can manage question options" ON question_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assessment sessions policies (corrected)
CREATE POLICY "Users can view their own assessment sessions" ON assessment_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment sessions" ON assessment_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment sessions" ON assessment_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all assessment sessions" ON assessment_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage assessment sessions" ON assessment_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User responses policies (corrected)
CREATE POLICY "Users can view their own responses" ON user_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_sessions 
      WHERE id = user_responses.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own responses" ON user_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessment_sessions 
      WHERE id = user_responses.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all user responses" ON user_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage user responses" ON user_responses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assessment results policies (corrected)
CREATE POLICY "Users can view their own results" ON assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_sessions 
      WHERE id = assessment_results.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all assessment results" ON assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage assessment results" ON assessment_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
