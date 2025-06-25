-- supabase/migrations/004_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test configurations policies
CREATE POLICY "Anyone can view active test configurations" ON test_configurations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage test configurations" ON test_configurations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test types policies
CREATE POLICY "Anyone can view active test types" ON test_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage test types" ON test_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Questions policies
CREATE POLICY "Anyone can view active questions" ON questions
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM test_types 
      WHERE id = questions.test_type_id AND is_active = true
    )
  );

CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Question options policies
CREATE POLICY "Anyone can view question options for active questions" ON question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM questions 
      WHERE id = question_options.question_id 
      AND is_active = true
      AND EXISTS (
        SELECT 1 FROM test_types 
        WHERE id = questions.test_type_id AND is_active = true
      )
    )
  );

CREATE POLICY "Admins can manage question options" ON question_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assessment sessions policies
CREATE POLICY "Users can view their own assessment sessions" ON assessment_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment sessions" ON assessment_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment sessions" ON assessment_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all assessment sessions" ON assessment_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all assessment sessions" ON assessment_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User responses policies
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
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own responses" ON user_responses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM assessment_sessions 
      WHERE id = user_responses.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all user responses" ON user_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Assessment results policies
CREATE POLICY "Users can view their own assessment results" ON assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessment_sessions 
      WHERE id = assessment_results.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own assessment results" ON assessment_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessment_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all assessment results" ON assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all assessment results" ON assessment_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user owns session
CREATE OR REPLACE FUNCTION owns_session(session_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM assessment_sessions 
    WHERE id = session_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;