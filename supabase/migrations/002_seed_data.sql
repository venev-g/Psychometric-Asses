-- supabase/migrations/002_seed_data.sql

-- Insert test types
INSERT INTO public.test_types (name, slug, description, instructions, estimated_duration_minutes, scoring_algorithm) VALUES
(
  'Dominant Intelligence Assessment',
  'dominant-intelligence',
  'Based on Howard Gardner''s Theory of Multiple Intelligences, this assessment identifies your strongest intelligence areas across 8 different types.',
  'For each statement, rate how accurately it describes you on a scale of 1 (strongly disagree) to 5 (strongly agree). Answer honestly and go with your first instinct.',
  15,
  '{
    "categories": ["linguistic", "logical-mathematical", "spatial", "bodily-kinesthetic", "musical", "interpersonal", "intrapersonal", "naturalistic"],
    "scoring_method": "weighted_sum",
    "normalization": "percentage"
  }'::jsonb
),
(
  'Personality Pattern Assessment',
  'personality-pattern',
  'Based on the DISC personality model, this assessment reveals your behavioral patterns and working style preferences.',
  'For each set of words, select the one that best describes you in most situations. Choose the word that feels most natural to you.',
  12,
  '{
    "categories": ["dominance", "influence", "steadiness", "conscientiousness"],
    "scoring_method": "forced_choice",
    "normalization": "percentage"
  }'::jsonb
),
(
  'VARK Learning Style Assessment',
  'vark',
  'Discover your learning preferences across Visual, Auditory, Reading/Writing, and Kinesthetic modalities.',
  'For each question, select all options that apply to you. You may choose multiple answers if they all describe your preferences.',
  10,
  '{
    "categories": ["visual", "auditory", "reading-writing", "kinesthetic"],
    "scoring_method": "multiselect_count",
    "normalization": "percentage"
  }'::jsonb
);

-- Insert sample test configuration
INSERT INTO public.test_configurations (name, description, max_attempts, time_limit_minutes) VALUES
(
  'Complete Psychometric Profile',
  'A comprehensive assessment covering intelligence patterns, personality traits, and learning preferences. Perfect for personal development and career planning.',
  3,
  45
),
(
  'Quick Personality Check',
  'A focused assessment on personality patterns and learning styles for quick insights.',
  5,
  25
);

-- Get the configuration IDs for test sequences
DO $$
DECLARE
    complete_profile_id UUID;
    quick_check_id UUID;
    intelligence_test_id UUID;
    personality_test_id UUID;
    vark_test_id UUID;
BEGIN
    -- Get configuration IDs
    SELECT id INTO complete_profile_id FROM public.test_configurations WHERE name = 'Complete Psychometric Profile';
    SELECT id INTO quick_check_id FROM public.test_configurations WHERE name = 'Quick Personality Check';
    
    -- Get test type IDs
    SELECT id INTO intelligence_test_id FROM public.test_types WHERE slug = 'dominant-intelligence';
    SELECT id INTO personality_test_id FROM public.test_types WHERE slug = 'personality-pattern';
    SELECT id INTO vark_test_id FROM public.test_types WHERE slug = 'vark';
    
    -- Insert test sequences for complete profile
    INSERT INTO public.test_sequences (configuration_id, test_type_id, sequence_order, is_required) VALUES
    (complete_profile_id, intelligence_test_id, 0, true),
    (complete_profile_id, personality_test_id, 1, true),
    (complete_profile_id, vark_test_id, 2, true);
    
    -- Insert test sequences for quick check
    INSERT INTO public.test_sequences (configuration_id, test_type_id, sequence_order, is_required) VALUES
    (quick_check_id, personality_test_id, 0, true),
    (quick_check_id, vark_test_id, 1, true);
END $$;