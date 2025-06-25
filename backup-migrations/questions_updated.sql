-- Insert Updated Dominant Intelligence Questions
DO $$
DECLARE
    intelligence_test_id UUID;
BEGIN
    SELECT id INTO intelligence_test_id FROM public.test_types WHERE slug = 'dominant-intelligence';

    INSERT INTO public.questions (test_type_id, question_text, question_type, category, weight, order_index) VALUES
    -- Logical-Mathematical
    (intelligence_test_id, 'Do you often break things into parts to understand how they work?', 'rating_scale', 'logical-mathematical', 1.0, 1),
    (intelligence_test_id, 'Do puzzles, patterns, or debugging code give you a strange sense of satisfaction?', 'rating_scale', 'logical-mathematical', 1.0, 2),
    (intelligence_test_id, 'Do you enjoy analyzing data to spot trends or inconsistencies?', 'rating_scale', 'logical-mathematical', 1.0, 3),

    -- Spatial
    (intelligence_test_id, 'Can you easily visualize how things look from different angles in your mind?', 'rating_scale', 'spatial', 1.0, 4),
    (intelligence_test_id, 'Do you sketch diagrams or doodle to explain your ideas?', 'rating_scale', 'spatial', 1.0, 5),
    (intelligence_test_id, 'Do you enjoy using design tools or building models in software or real life?', 'rating_scale', 'spatial', 1.0, 6),

    -- Linguistic
    (intelligence_test_id, 'Do you enjoy explaining complex ideas with clarity (spoken or written)?', 'rating_scale', 'linguistic', 1.0, 7),
    (intelligence_test_id, 'Do you find it easy to come up with analogies or examples to explain something?', 'rating_scale', 'linguistic', 1.0, 8),
    (intelligence_test_id, 'Do you learn better when you write about or teach what you''ve learned?', 'rating_scale', 'linguistic', 1.0, 9),

    -- Interpersonal
    (intelligence_test_id, 'Do people often come to you for advice or to resolve group conflicts?', 'rating_scale', 'interpersonal', 1.0, 10),
    (intelligence_test_id, 'Do you adapt your communication style based on who you''re speaking with?', 'rating_scale', 'interpersonal', 1.0, 11),

    -- Intrapersonal
    (intelligence_test_id, 'Do you find yourself journaling or reflecting on why you feel a certain way?', 'rating_scale', 'intrapersonal', 1.0, 12),
    (intelligence_test_id, 'Do you prefer figuring out things on your own before discussing with others?', 'rating_scale', 'intrapersonal', 1.0, 13),

    -- Communication
    (intelligence_test_id, 'Do you enjoy group presentations, storytelling, or persuading others with ideas?', 'rating_scale', 'communication', 1.0, 14),
    (intelligence_test_id, 'Do you notice subtle body language cues or tone shifts in conversations?', 'rating_scale', 'communication', 1.0, 15),

    -- Musical
    (intelligence_test_id, 'Do you remember things better when there’s rhythm, rhyme, or music involved?', 'rating_scale', 'musical', 1.0, 16),
    (intelligence_test_id, 'Do you often tap your fingers or hum while thinking deeply?', 'rating_scale', 'musical', 1.0, 17),

    -- Bodily-Kinesthetic
    (intelligence_test_id, 'Do you find it easier to understand concepts when you''re building or moving?', 'rating_scale', 'bodily-kinesthetic', 1.0, 18),
    (intelligence_test_id, 'Do you learn better through doing (labs, demos, tinkering) than reading?', 'rating_scale', 'bodily-kinesthetic', 1.0, 19),

    -- Naturalistic
    (intelligence_test_id, 'Do you feel drawn to understanding how natural systems (like ecosystems or machines) work?', 'rating_scale', 'naturalistic', 1.0, 20),

    -- Creative
    (intelligence_test_id, 'Do you enjoy brainstorming wild ideas or exploring abstract ''what ifs''?', 'rating_scale', 'creative', 1.0, 21);
END $$;

-- Insert Personality Pattern Questions (Mini MBTI Style)
DO $$
DECLARE
    personality_test_id UUID;
BEGIN
    SELECT id INTO personality_test_id FROM public.test_types WHERE slug = 'personality-pattern';

    INSERT INTO public.questions (test_type_id, question_text, question_type, category, weight, order_index, options) VALUES
    -- Introvert / Extrovert
    (personality_test_id, 'When you''re drained, do you recharge by being alone or with friends?', 'multiple_choice', 'introvert-extrovert', 1.0, 1,
     '[{"text": "Being alone", "value": "introvert", "category": "introvert"}, {"text": "With friends", "value": "extrovert", "category": "extrovert"}]'::jsonb),
    (personality_test_id, 'Do you prefer deep 1-on-1 conversations or group brainstorming?', 'multiple_choice', 'introvert-extrovert', 1.0, 2,
     '[{"text": "1-on-1 conversations", "value": "introvert", "category": "introvert"}, {"text": "Group brainstorming", "value": "extrovert", "category": "extrovert"}]'::jsonb),

    -- Thinker / Feeler
    (personality_test_id, 'In tough decisions, do you trust logic more or gut feelings?', 'multiple_choice', 'thinker-feeler', 1.0, 3,
     '[{"text": "Logic", "value": "thinker", "category": "thinker"}, {"text": "Gut feelings", "value": "feeler", "category": "feeler"}]'::jsonb),
    (personality_test_id, 'Do you prioritize being right or being kind?', 'multiple_choice', 'thinker-feeler', 1.0, 4,
     '[{"text": "Being right", "value": "thinker", "category": "thinker"}, {"text": "Being kind", "value": "feeler", "category": "feeler"}]'::jsonb),

    -- Planner / Flexible
    (personality_test_id, 'Do you like planning every detail or going with the flow?', 'multiple_choice', 'planner-flexible', 1.0, 5,
     '[{"text": "Planning every detail", "value": "planner", "category": "planner"}, {"text": "Going with the flow", "value": "flexible", "category": "flexible"}]'::jsonb),
    (personality_test_id, 'Are deadlines energizing or overwhelming for you?', 'multiple_choice', 'planner-flexible', 1.0, 6,
     '[{"text": "Energizing", "value": "planner", "category": "planner"}, {"text": "Overwhelming", "value": "flexible", "category": "flexible"}]'::jsonb),

    -- Practical / Imaginative
    (personality_test_id, 'Do you focus on what’s proven or what’s possible?', 'multiple_choice', 'practical-imaginative', 1.0, 7,
     '[{"text": "What''s proven", "value": "practical", "category": "practical"}, {"text": "What''s possible", "value": "imaginative", "category": "imaginative"}]'::jsonb),
    (personality_test_id, 'Do you love fixing what''s broken or dreaming what''s not yet built?', 'multiple_choice', 'practical-imaginative', 1.0, 8,
     '[{"text": "Fixing what''s broken", "value": "practical", "category": "practical"}, {"text": "Dreaming what''s not yet built", "value": "imaginative", "category": "imaginative"}]'::jsonb);
END $$;

-- Insert Updated VARK Questions
DO $$
DECLARE
    vark_test_id UUID;
BEGIN
    SELECT id INTO vark_test_id FROM public.test_types WHERE slug = 'vark';

    INSERT INTO public.questions (test_type_id, question_text, question_type, category, weight, order_index, options) VALUES
    (vark_test_id, 'When learning a new software tool, what helps you most?', 'multiselect', 'mixed', 1.0, 1,
     '[{"text": "Watching a demo", "value": "visual", "category": "v"}, {"text": "Listening to explanation", "value": "auditory", "category": "a"}, {"text": "Reading manual", "value": "reading", "category": "r"}, {"text": "Trying it hands-on", "value": "kinesthetic", "category": "k"}]'::jsonb),
     
    (vark_test_id, 'How do you revise for exams?', 'multiselect', 'mixed', 1.0, 2,
     '[{"text": "Diagrams/maps", "value": "visual", "category": "v"}, {"text": "Recorded lectures", "value": "auditory", "category": "a"}, {"text": "Rewriting notes", "value": "reading", "category": "r"}, {"text": "Building models/testing code", "value": "kinesthetic", "category": "k"}]'::jsonb),

    (vark_test_id, 'When stuck on a concept…', 'multiselect', 'mixed', 1.0, 3,
     '[{"text": "Find a visual", "value": "visual", "category": "v"}, {"text": "Call a friend", "value": "auditory", "category": "a"}, {"text": "Re-read notes", "value": "reading", "category": "r"}, {"text": "Rebuild from scratch", "value": "kinesthetic", "category": "k"}]'::jsonb),

    (vark_test_id, 'To explain something complex to others…', 'multiselect', 'mixed', 1.0, 4,
     '[{"text": "Draw it out", "value": "visual", "category": "v"}, {"text": "Explain verbally", "value": "auditory", "category": "a"}, {"text": "Write a step-by-step guide", "value": "reading", "category": "r"}, {"text": "Show a prototype or example", "value": "kinesthetic", "category": "k"}]'::jsonb),

    (vark_test_id, 'Which of these is most like you?', 'multiselect', 'mixed', 1.0, 5,
     '[{"text": "I think in images", "value": "visual", "category": "v"}, {"text": "I replay conversations in my head", "value": "auditory", "category": "a"}, {"text": "I make lists", "value": "reading", "category": "r"}, {"text": "I build things to understand", "value": "kinesthetic", "category": "k"}]'::jsonb);
END $$;
