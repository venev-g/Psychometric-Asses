-- supabase/migrations/003_questions_data.sql

-- Insert Dominant Intelligence Questions
DO $$
DECLARE
    intelligence_test_id UUID;
BEGIN
    SELECT id INTO intelligence_test_id FROM public.test_types WHERE slug = 'dominant-intelligence';
    
    -- Linguistic Intelligence Questions
    INSERT INTO public.questions (test_type_id, question_text, question_type, category, weight, order_index) VALUES
    (intelligence_test_id, 'I enjoy reading books, magazines, and newspapers in my spare time.', 'rating_scale', 'linguistic', 1.0, 1),
    (intelligence_test_id, 'I find it easy to express my thoughts and ideas in writing.', 'rating_scale', 'linguistic', 1.0, 2),
    (intelligence_test_id, 'I enjoy word games like crosswords, Scrabble, or word puzzles.', 'rating_scale', 'linguistic', 1.0, 3),
    (intelligence_test_id, 'I can easily remember quotes, sayings, or jokes.', 'rating_scale', 'linguistic', 1.0, 4),
    (intelligence_test_id, 'I enjoy listening to podcasts, audiobooks, or talk radio.', 'rating_scale', 'linguistic', 1.0, 5),
    
    -- Logical-Mathematical Intelligence Questions
    (intelligence_test_id, 'I enjoy solving math problems and logic puzzles.', 'rating_scale', 'logical-mathematical', 1.0, 6),
    (intelligence_test_id, 'I like to analyze patterns and relationships in data.', 'rating_scale', 'logical-mathematical', 1.0, 7),
    (intelligence_test_id, 'I prefer to have things organized in a logical sequence.', 'rating_scale', 'logical-mathematical', 1.0, 8),
    (intelligence_test_id, 'I enjoy strategy games like chess or complex board games.', 'rating_scale', 'logical-mathematical', 1.0, 9),
    (intelligence_test_id, 'I like to understand how things work mechanically.', 'rating_scale', 'logical-mathematical', 1.0, 10),
    
    -- Spatial Intelligence Questions
    (intelligence_test_id, 'I have a good sense of direction and rarely get lost.', 'rating_scale', 'spatial', 1.0, 11),
    (intelligence_test_id, 'I enjoy drawing, painting, or other visual arts.', 'rating_scale', 'spatial', 1.0, 12),
    (intelligence_test_id, 'I can easily visualize how objects look from different angles.', 'rating_scale', 'spatial', 1.0, 13),
    (intelligence_test_id, 'I prefer information presented in charts, graphs, or diagrams.', 'rating_scale', 'spatial', 1.0, 14),
    (intelligence_test_id, 'I enjoy rearranging furniture or decorating spaces.', 'rating_scale', 'spatial', 1.0, 15),
    
    -- Bodily-Kinesthetic Intelligence Questions
    (intelligence_test_id, 'I learn best when I can move around or use my hands.', 'rating_scale', 'bodily-kinesthetic', 1.0, 16),
    (intelligence_test_id, 'I enjoy sports, dancing, or other physical activities.', 'rating_scale', 'bodily-kinesthetic', 1.0, 17),
    (intelligence_test_id, 'I often use gestures when I speak.', 'rating_scale', 'bodily-kinesthetic', 1.0, 18),
    (intelligence_test_id, 'I like to build or repair things with my hands.', 'rating_scale', 'bodily-kinesthetic', 1.0, 19),
    (intelligence_test_id, 'I have good coordination and body awareness.', 'rating_scale', 'bodily-kinesthetic', 1.0, 20),
    
    -- Musical Intelligence Questions
    (intelligence_test_id, 'I can easily remember melodies and songs.', 'rating_scale', 'musical', 1.0, 21),
    (intelligence_test_id, 'I notice when music is off-key or out of rhythm.', 'rating_scale', 'musical', 1.0, 22),
    (intelligence_test_id, 'I often have a song playing in my head.', 'rating_scale', 'musical', 1.0, 23),
    (intelligence_test_id, 'I enjoy playing musical instruments or singing.', 'rating_scale', 'musical', 1.0, 24),
    (intelligence_test_id, 'I find it easier to work or study with music playing.', 'rating_scale', 'musical', 1.0, 25),
    
    -- Interpersonal Intelligence Questions
    (intelligence_test_id, 'I enjoy working in groups and team projects.', 'rating_scale', 'interpersonal', 1.0, 26),
    (intelligence_test_id, 'I can easily sense other people''s moods and feelings.', 'rating_scale', 'interpersonal', 1.0, 27),
    (intelligence_test_id, 'I prefer to talk through problems with others.', 'rating_scale', 'interpersonal', 1.0, 28),
    (intelligence_test_id, 'I enjoy meeting new people and making friends.', 'rating_scale', 'interpersonal', 1.0, 29),
    (intelligence_test_id, 'Others often come to me for advice or support.', 'rating_scale', 'interpersonal', 1.0, 30),
    
    -- Intrapersonal Intelligence Questions
    (intelligence_test_id, 'I prefer to work alone on projects.', 'rating_scale', 'intrapersonal', 1.0, 31),
    (intelligence_test_id, 'I have a clear understanding of my own emotions.', 'rating_scale', 'intrapersonal', 1.0, 32),
    (intelligence_test_id, 'I enjoy quiet time for reflection and thinking.', 'rating_scale', 'intrapersonal', 1.0, 33),
    (intelligence_test_id, 'I have strong personal opinions and beliefs.', 'rating_scale', 'intrapersonal', 1.0, 34),
    (intelligence_test_id, 'I set and work toward personal goals.', 'rating_scale', 'intrapersonal', 1.0, 35),
    
    -- Naturalistic Intelligence Questions
    (intelligence_test_id, 'I enjoy spending time outdoors in nature.', 'rating_scale', 'naturalistic', 1.0, 36),
    (intelligence_test_id, 'I can easily identify different plants, animals, or natural phenomena.', 'rating_scale', 'naturalistic', 1.0, 37),
    (intelligence_test_id, 'I notice patterns and changes in weather or seasons.', 'rating_scale', 'naturalistic', 1.0, 38),
    (intelligence_test_id, 'I enjoy gardening or caring for plants and animals.', 'rating_scale', 'naturalistic', 1.0, 39),
    (intelligence_test_id, 'I prefer natural settings over urban environments.', 'rating_scale', 'naturalistic', 1.0, 40);
END $$;

-- Insert Personality Pattern (DISC) Questions
DO $$
DECLARE
    personality_test_id UUID;
BEGIN
    SELECT id INTO personality_test_id FROM public.test_types WHERE slug = 'personality-pattern';
    
    -- DISC Questions with multiple choice options
    INSERT INTO public.questions (test_type_id, question_text, question_type, category, weight, order_index, options) VALUES
    (personality_test_id, 'When working on a team project, I tend to:', 'multiple_choice', 'dominance', 1.0, 1, 
     '[
       {"text": "Take charge and direct the team", "value": "D", "category": "dominance"},
       {"text": "Motivate and inspire team members", "value": "I", "category": "influence"},
       {"text": "Support others and maintain harmony", "value": "S", "category": "steadiness"},
       {"text": "Focus on quality and accuracy", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'In a stressful situation, I usually:', 'multiple_choice', 'dominance', 1.0, 2,
     '[
       {"text": "Take quick action to solve the problem", "value": "D", "category": "dominance"},
       {"text": "Talk to others about the situation", "value": "I", "category": "influence"},
       {"text": "Stay calm and patient", "value": "S", "category": "steadiness"},
       {"text": "Analyze all the details carefully", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'My ideal work environment is:', 'multiple_choice', 'influence', 1.0, 3,
     '[
       {"text": "Fast-paced with variety and challenges", "value": "D", "category": "dominance"},
       {"text": "Social and collaborative", "value": "I", "category": "influence"},
       {"text": "Stable and supportive", "value": "S", "category": "steadiness"},
       {"text": "Organized and structured", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'When making decisions, I prefer to:', 'multiple_choice', 'conscientiousness', 1.0, 4,
     '[
       {"text": "Decide quickly and move forward", "value": "D", "category": "dominance"},
       {"text": "Get input from others first", "value": "I", "category": "influence"},
       {"text": "Take time to consider all perspectives", "value": "S", "category": "steadiness"},
       {"text": "Research and analyze all options", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'People would describe me as:', 'multiple_choice', 'influence', 1.0, 5,
     '[
       {"text": "Confident and direct", "value": "D", "category": "dominance"},
       {"text": "Enthusiastic and outgoing", "value": "I", "category": "influence"},
       {"text": "Patient and reliable", "value": "S", "category": "steadiness"},
       {"text": "Careful and thorough", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'When communicating with others, I:', 'multiple_choice', 'steadiness', 1.0, 6,
     '[
       {"text": "Get straight to the point", "value": "D", "category": "dominance"},
       {"text": "Use stories and examples", "value": "I", "category": "influence"},
       {"text": "Listen carefully and ask questions", "value": "S", "category": "steadiness"},
       {"text": "Provide detailed information", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'My approach to change is to:', 'multiple_choice', 'steadiness', 1.0, 7,
     '[
       {"text": "Embrace it quickly", "value": "D", "category": "dominance"},
       {"text": "See it as an opportunity", "value": "I", "category": "influence"},
       {"text": "Prefer gradual transitions", "value": "S", "category": "steadiness"},
       {"text": "Plan carefully before implementing", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'When setting goals, I focus on:', 'multiple_choice', 'dominance', 1.0, 8,
     '[
       {"text": "Achieving results quickly", "value": "D", "category": "dominance"},
       {"text": "Creating excitement and buy-in", "value": "I", "category": "influence"},
       {"text": "Building consensus and support", "value": "S", "category": "steadiness"},
       {"text": "Setting realistic and detailed plans", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'In conflict situations, I tend to:', 'multiple_choice', 'dominance', 1.0, 9,
     '[
       {"text": "Address issues directly", "value": "D", "category": "dominance"},
       {"text": "Use humor to ease tension", "value": "I", "category": "influence"},
       {"text": "Seek compromise and understanding", "value": "S", "category": "steadiness"},
       {"text": "Focus on facts and logic", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'My learning style is best described as:', 'multiple_choice', 'conscientiousness', 1.0, 10,
     '[
       {"text": "Learning by doing", "value": "D", "category": "dominance"},
       {"text": "Learning through discussion", "value": "I", "category": "influence"},
       {"text": "Learning through observation", "value": "S", "category": "steadiness"},
       {"text": "Learning through research", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'When leading others, I:', 'multiple_choice', 'influence', 1.0, 11,
     '[
       {"text": "Set clear expectations and deadlines", "value": "D", "category": "dominance"},
       {"text": "Inspire and motivate the team", "value": "I", "category": "influence"},
       {"text": "Support individual team members", "value": "S", "category": "steadiness"},
       {"text": "Provide detailed guidance and procedures", "value": "C", "category": "conscientiousness"}
     ]'::jsonb),
     
    (personality_test_id, 'My biggest fear at work is:', 'multiple_choice', 'steadiness', 1.0, 12,
     '[
       {"text": "Being micromanaged", "value": "D", "category": "dominance"},
       {"text": "Being ignored or rejected", "value": "I", "category": "influence"},
       {"text": "Sudden major changes", "value": "S", "category": "steadiness"},
       {"text": "Making mistakes", "value": "C", "category": "conscientiousness"}
     ]'::jsonb);
END $$;

-- Insert VARK Questions
DO $$
DECLARE
    vark_test_id UUID;
BEGIN
    SELECT id INTO vark_test_id FROM public.test_types WHERE slug = 'vark';
    
    INSERT INTO public.questions (test_type_id, question_text, question_type, category, weight, order_index, options) VALUES
    (vark_test_id, 'When I need to learn something new, I prefer to:', 'multiselect', 'mixed', 1.0, 1,
     '[
       {"text": "See diagrams, charts, or pictures", "value": "visual", "category": "v"},
       {"text": "Listen to someone explain it", "value": "auditory", "category": "a"},
       {"text": "Read about it in detail", "value": "reading", "category": "r"},
       {"text": "Try it out myself", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When giving directions to someone, I would:', 'multiselect', 'mixed', 1.0, 2,
     '[
       {"text": "Draw a map or sketch", "value": "visual", "category": "v"},
       {"text": "Tell them the route verbally", "value": "auditory", "category": "a"},
       {"text": "Write down the directions", "value": "reading", "category": "r"},
       {"text": "Go with them or show them", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When I''m trying to remember something, I:', 'multiselect', 'mixed', 1.0, 3,
     '[
       {"text": "Picture it in my mind", "value": "visual", "category": "v"},
       {"text": "Say it to myself or out loud", "value": "auditory", "category": "a"},
       {"text": "Write it down", "value": "reading", "category": "r"},
       {"text": "Associate it with an action or movement", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When reading for pleasure, I prefer:', 'multiselect', 'mixed', 1.0, 4,
     '[
       {"text": "Books with lots of pictures or illustrations", "value": "visual", "category": "v"},
       {"text": "Audiobooks or podcasts", "value": "auditory", "category": "a"},
       {"text": "Traditional text-based books", "value": "reading", "category": "r"},
       {"text": "Books about real experiences or how-to guides", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When I have to solve a problem, I:', 'multiselect', 'mixed', 1.0, 5,
     '[
       {"text": "Draw it out or make a flowchart", "value": "visual", "category": "v"},
       {"text": "Talk it through with someone", "value": "auditory", "category": "a"},
       {"text": "Research and read about similar problems", "value": "reading", "category": "r"},
       {"text": "Try different solutions until something works", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'In a meeting, I prefer to:', 'multiselect', 'mixed', 1.0, 6,
     '[
       {"text": "See presentations with slides and visuals", "value": "visual", "category": "v"},
       {"text": "Participate in discussions", "value": "auditory", "category": "a"},
       {"text": "Receive written agendas and materials", "value": "reading", "category": "r"},
       {"text": "Do hands-on activities or workshops", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When explaining something to others, I tend to:', 'multiselect', 'mixed', 1.0, 7,
     '[
       {"text": "Use diagrams or draw pictures", "value": "visual", "category": "v"},
       {"text": "Explain it verbally", "value": "auditory", "category": "a"},
       {"text": "Provide written instructions", "value": "reading", "category": "r"},
       {"text": "Demonstrate or show them how", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When I''m stressed or need to relax, I prefer to:', 'multiselect', 'mixed', 1.0, 8,
     '[
       {"text": "Look at nature or beautiful images", "value": "visual", "category": "v"},
       {"text": "Listen to music or calming sounds", "value": "auditory", "category": "a"},
       {"text": "Read a book or magazine", "value": "reading", "category": "r"},
       {"text": "Do physical exercise or activities", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When shopping for something important, I:', 'multiselect', 'mixed', 1.0, 9,
     '[
       {"text": "Look at and compare products visually", "value": "visual", "category": "v"},
       {"text": "Ask for recommendations from others", "value": "auditory", "category": "a"},
       {"text": "Read reviews and product descriptions", "value": "reading", "category": "r"},
       {"text": "Test and handle the products myself", "value": "kinesthetic", "category": "k"}
     ]'::jsonb),
     
    (vark_test_id, 'When taking notes, I prefer to:', 'multiselect', 'mixed', 1.0, 10,
     '[
       {"text": "Use colors, highlights, and visual organization", "value": "visual", "category": "v"},
       {"text": "Record audio or discuss with others", "value": "auditory", "category": "a"},
       {"text": "Write detailed text notes", "value": "reading", "category": "r"},
       {"text": "Use symbols, arrows, and quick sketches", "value": "kinesthetic", "category": "k"}
     ]'::jsonb);
END $$;