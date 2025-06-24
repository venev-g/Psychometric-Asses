-- supabase/seed.sql

-- Insert sample test types
INSERT INTO test_types (id, name, slug, description, version, is_active, scoring_algorithm, instructions, estimated_duration_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dominant Intelligence Assessment', 'dominant-intelligence', 'Assess your dominant type of intelligence based on Howard Gardner''s Theory of Multiple Intelligences', '1.0', true, '{}', 'This assessment will help you identify your dominant intelligence type. Answer each question honestly based on your preferences and tendencies.', 15),
('550e8400-e29b-41d4-a716-446655440002', 'VARK Learning Style Assessment', 'vark', 'Determine your preferred learning style: Visual, Auditory, Reading/Writing, or Kinesthetic', '1.0', true, '{}', 'This assessment identifies how you prefer to learn and process information. Choose the option that best describes your preference for each scenario.', 10),
('550e8400-e29b-41d4-a716-446655440003', 'Personality Pattern Assessment', 'personality-pattern', 'Discover your personality pattern based on the DISC assessment model', '1.0', true, '{}', 'This assessment reveals your personality pattern across four dimensions: Dominance, Influence, Steadiness, and Conscientiousness.', 20);

-- Insert sample test configuration
INSERT INTO test_configurations (id, name, description, is_active, max_attempts, time_limit_minutes, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Complete Psychometric Battery', 'A comprehensive assessment including all available tests', true, 3, 60, '550e8400-e29b-41d4-a716-446655440000');

-- Link test types to configuration
INSERT INTO configuration_test_types (configuration_id, test_type_id, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 1),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 2),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 3);

-- Insert sample questions for Dominant Intelligence Assessment
INSERT INTO questions (id, test_type_id, question_text, question_type, category, subcategory, weight, is_active, order_index) VALUES
-- Linguistic Intelligence
('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440001', 'I enjoy reading books, magazines, and newspapers', 'rating_scale', 'linguistic', null, 1.0, true, 1),
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'I find it easy to express my thoughts in writing', 'rating_scale', 'linguistic', null, 1.0, true, 2),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'I enjoy word games and puzzles', 'rating_scale', 'linguistic', null, 1.0, true, 3),

-- Logical-Mathematical Intelligence
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'I enjoy solving math problems and working with numbers', 'rating_scale', 'logical_mathematical', null, 1.0, true, 4),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440001', 'I like to analyze patterns and logical sequences', 'rating_scale', 'logical_mathematical', null, 1.0, true, 5),
('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440001', 'I prefer to have things organized and systematic', 'rating_scale', 'logical_mathematical', null, 1.0, true, 6),

-- Spatial Intelligence
('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440001', 'I can easily visualize objects from different angles', 'rating_scale', 'spatial', null, 1.0, true, 7),
('550e8400-e29b-41d4-a716-446655440107', '550e8400-e29b-41d4-a716-446655440001', 'I enjoy drawing, painting, or other visual arts', 'rating_scale', 'spatial', null, 1.0, true, 8),
('550e8400-e29b-41d4-a716-446655440108', '550e8400-e29b-41d4-a716-446655440001', 'I have a good sense of direction and rarely get lost', 'rating_scale', 'spatial', null, 1.0, true, 9);

-- Insert question options for rating scale questions
INSERT INTO question_options (id, question_id, text, value, category) VALUES
-- Rating scale options (1-5)
('opt001', '550e8400-e29b-41d4-a716-446655440100', 'Strongly Disagree', 1, null),
('opt002', '550e8400-e29b-41d4-a716-446655440100', 'Disagree', 2, null),
('opt003', '550e8400-e29b-41d4-a716-446655440100', 'Neutral', 3, null),
('opt004', '550e8400-e29b-41d4-a716-446655440100', 'Agree', 4, null),
('opt005', '550e8400-e29b-41d4-a716-446655440100', 'Strongly Agree', 5, null);

-- Copy options for other questions (simplified for brevity)
-- In practice, you'd insert options for each question

-- Insert sample VARK questions
INSERT INTO questions (id, test_type_id, question_text, question_type, category, subcategory, weight, is_active, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440002', 'When learning something new, I prefer to:', 'multiple_choice', 'learning_preference', null, 1.0, true, 1),
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'When giving directions to someone, I would:', 'multiple_choice', 'communication', null, 1.0, true, 2),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', 'When I have free time, I prefer to:', 'multiple_choice', 'leisure', null, 1.0, true, 3);

-- Insert VARK question options
INSERT INTO question_options (id, question_id, text, value, category) VALUES
-- Question 1 options
('vark001', '550e8400-e29b-41d4-a716-446655440200', 'See diagrams, charts, or demonstrations', 1, 'visual'),
('vark002', '550e8400-e29b-41d4-a716-446655440200', 'Listen to someone explain it', 2, 'auditory'),
('vark003', '550e8400-e29b-41d4-a716-446655440200', 'Read about it in detail', 3, 'reading_writing'),
('vark004', '550e8400-e29b-41d4-a716-446655440200', 'Try it out hands-on', 4, 'kinesthetic'),

-- Question 2 options
('vark005', '550e8400-e29b-41d4-a716-446655440201', 'Draw a map or diagram', 1, 'visual'),
('vark006', '550e8400-e29b-41d4-a716-446655440201', 'Explain verbally with landmarks', 2, 'auditory'),
('vark007', '550e8400-e29b-41d4-a716-446655440201', 'Write down the directions', 3, 'reading_writing'),
('vark008', '550e8400-e29b-41d4-a716-446655440201', 'Walk with them to show the way', 4, 'kinesthetic');

-- Insert sample Personality Pattern questions
INSERT INTO questions (id, test_type_id, question_text, question_type, category, subcategory, weight, is_active, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440003', 'I am usually the one who takes charge in group situations', 'rating_scale', 'dominance', null, 1.0, true, 1),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', 'I enjoy meeting new people and building relationships', 'rating_scale', 'influence', null, 1.0, true, 2),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', 'I prefer stability and consistency in my work environment', 'rating_scale', 'steadiness', null, 1.0, true, 3),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440003', 'I pay close attention to details and accuracy', 'rating_scale', 'conscientiousness', null, 1.0, true, 4);

-- Create a sample admin user (password should be hashed in real implementation)
INSERT INTO users (id, email, full_name, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@psychometric.com', 'System Administrator', 'admin', NOW(), NOW());

-- Create a sample regular user
INSERT INTO users (id, email, full_name, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655441111', 'user@example.com', 'John Doe', 'user', NOW(), NOW());

-- Create a sample assessment session
INSERT INTO assessment_sessions (id, user_id, configuration_id, status, current_test_index, total_tests, started_at, metadata) VALUES
('550e8400-e29b-41d4-a716-446655442222', '550e8400-e29b-41d4-a716-446655441111', '550e8400-e29b-41d4-a716-446655440010', 'completed', 3, 3, NOW() - INTERVAL '2 hours', '{"browser": "Chrome", "device": "Desktop"}');

-- Create sample user responses
INSERT INTO user_responses (id, session_id, question_id, response_value, response_time_ms, created_at) VALUES
('resp001', '550e8400-e29b-41d4-a716-446655442222', '550e8400-e29b-41d4-a716-446655440100', 4, 3500, NOW() - INTERVAL '1 hour 50 minutes'),
('resp002', '550e8400-e29b-41d4-a716-446655442222', '550e8400-e29b-41d4-a716-446655440101', 5, 2800, NOW() - INTERVAL '1 hour 49 minutes'),
('resp003', '550e8400-e29b-41d4-a716-446655442222', '550e8400-e29b-41d4-a716-446655440102', 3, 4200, NOW() - INTERVAL '1 hour 48 minutes');

-- Create sample assessment results
INSERT INTO assessment_results (id, session_id, test_type_id, raw_scores, processed_scores, recommendations, percentile_ranks, created_at) VALUES
('result001', '550e8400-e29b-41d4-a716-446655442222', '550e8400-e29b-41d4-a716-446655440001', 
'{"linguistic": 12, "logical_mathematical": 8, "spatial": 15, "bodily_kinesthetic": 6, "musical": 4, "interpersonal": 10, "intrapersonal": 9, "naturalistic": 7}',
'{"linguistic": 17, "logical_mathematical": 11, "spatial": 21, "bodily_kinesthetic": 8, "musical": 6, "interpersonal": 14, "intrapersonal": 13, "naturalistic": 10}',
'{"primary": "spatial", "secondary": "linguistic", "description": "You have strong spatial intelligence with good linguistic abilities. Consider careers in architecture, design, engineering, or writing."}',
'{"linguistic": 75, "logical_mathematical": 45, "spatial": 92, "bodily_kinesthetic": 30, "musical": 15, "interpersonal": 60, "intrapersonal": 55, "naturalistic": 40}',
NOW() - INTERVAL '1 hour');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_test_type_id ON questions(test_type_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_status ON assessment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_session_id ON assessment_results(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_test_type_id ON assessment_results(test_type_id);

-- Create views for common queries
CREATE VIEW user_session_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  COUNT(s.id) as total_sessions,
  COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
  COUNT(CASE WHEN s.status = 'in_progress' THEN 1 END) as active_sessions,
  MAX(s.started_at) as last_session_date
FROM users u
LEFT JOIN assessment_sessions s ON u.id = s.user_id
GROUP BY u.id, u.email, u.full_name;

CREATE VIEW assessment_statistics AS
SELECT 
  tt.id as test_type_id,
  tt.name as test_type_name,
  COUNT(ar.id) as total_results,
  AVG((ar.processed_scores->>'total')::numeric) as average_score,
  MIN(ar.created_at) as first_taken,
  MAX(ar.created_at) as last_taken
FROM test_types tt
LEFT JOIN assessment_results ar ON tt.id = ar.test_type_id
GROUP BY tt.id, tt.name;