-- Temporary bypass for initial setup
-- This migration temporarily relaxes RLS to allow seeding

-- Create a temporary bypass policy for test_configurations
CREATE POLICY "temporary_seed_access" ON test_configurations
  FOR ALL USING (true);

-- Create a temporary bypass policy for user_profiles during seeding
CREATE POLICY "temporary_user_creation" ON user_profiles
  FOR INSERT WITH CHECK (true);

-- Note: These should be removed after initial setup
