// src/app/api/admin/seed/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if test types already exist
    const { data: existingTestTypes } = await supabase
      .from('test_types')
      .select('id, slug')

    console.log('Existing test types:', existingTestTypes)

    if (existingTestTypes && existingTestTypes.length > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded', 
        testTypes: existingTestTypes 
      })
    }

    // Insert test types
    const { data: testTypes, error: testTypesError } = await supabase
      .from('test_types')
      .insert([
        {
          name: 'Dominant Intelligence Assessment',
          slug: 'dominant-intelligence',
          description: 'Based on Howard Gardner\'s Theory of Multiple Intelligences, this assessment identifies your strongest intelligence areas across 8 different types.',
          instructions: 'For each statement, rate how accurately it describes you on a scale of 1 (strongly disagree) to 5 (strongly agree). Answer honestly and go with your first instinct.',
          estimated_duration_minutes: 15,
          scoring_algorithm: {
            categories: ['linguistic', 'logical-mathematical', 'spatial', 'bodily-kinesthetic', 'musical', 'interpersonal', 'intrapersonal', 'naturalistic'],
            scoring_method: 'weighted_sum',
            normalization: 'percentage'
          },
          is_active: true
        },
        {
          name: 'Personality Pattern Assessment',
          slug: 'personality-pattern',
          description: 'Based on the DISC personality model, this assessment reveals your behavioral patterns and working style preferences.',
          instructions: 'For each set of words, select the one that best describes you in most situations. Choose the word that feels most natural to you.',
          estimated_duration_minutes: 12,
          scoring_algorithm: {
            categories: ['dominance', 'influence', 'steadiness', 'conscientiousness'],
            scoring_method: 'forced_choice',
            normalization: 'percentage'
          },
          is_active: true
        },
        {
          name: 'VARK Learning Style Assessment',
          slug: 'vark',
          description: 'Discover your learning preferences across Visual, Auditory, Reading/Writing, and Kinesthetic modalities.',
          instructions: 'For each question, select all options that apply to you. You may choose multiple answers if they all describe your preferences.',
          estimated_duration_minutes: 10,
          scoring_algorithm: {
            categories: ['visual', 'auditory', 'reading-writing', 'kinesthetic'],
            scoring_method: 'multiselect_count',
            normalization: 'percentage'
          },
          is_active: true
        }
      ])
      .select()

    if (testTypesError) {
      console.error('Error inserting test types:', testTypesError)
      throw testTypesError
    }

    console.log('Inserted test types:', testTypes)

    // Find the test type IDs
    const dominantTestType = testTypes.find(t => t.slug === 'dominant-intelligence')
    const personalityTestType = testTypes.find(t => t.slug === 'personality-pattern')
    const varkTestType = testTypes.find(t => t.slug === 'vark')

    // Questions based on the actual migration file (questions_updated.sql)
    const questions = [
      // Dominant Intelligence Questions (21 questions as per migration)
      // Logical-Mathematical
      { test_type_id: dominantTestType?.id, question_text: 'Do you often break things into parts to understand how they work?', question_type: 'rating_scale', category: 'logical-mathematical', weight: 1.0, order_index: 1, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do puzzles, patterns, or debugging code give you a strange sense of satisfaction?', question_type: 'rating_scale', category: 'logical-mathematical', weight: 1.0, order_index: 2, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you enjoy analyzing data to spot trends or inconsistencies?', question_type: 'rating_scale', category: 'logical-mathematical', weight: 1.0, order_index: 3, is_active: true },
      
      // Spatial
      { test_type_id: dominantTestType?.id, question_text: 'Can you easily visualize how things look from different angles in your mind?', question_type: 'rating_scale', category: 'spatial', weight: 1.0, order_index: 4, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you sketch diagrams or doodle to explain your ideas?', question_type: 'rating_scale', category: 'spatial', weight: 1.0, order_index: 5, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you enjoy using design tools or building models in software or real life?', question_type: 'rating_scale', category: 'spatial', weight: 1.0, order_index: 6, is_active: true },
      
      // Linguistic
      { test_type_id: dominantTestType?.id, question_text: 'Do you enjoy explaining complex ideas with clarity (spoken or written)?', question_type: 'rating_scale', category: 'linguistic', weight: 1.0, order_index: 7, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you find it easy to come up with analogies or examples to explain something?', question_type: 'rating_scale', category: 'linguistic', weight: 1.0, order_index: 8, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you learn better when you write about or teach what you\'ve learned?', question_type: 'rating_scale', category: 'linguistic', weight: 1.0, order_index: 9, is_active: true },
      
      // Interpersonal
      { test_type_id: dominantTestType?.id, question_text: 'Do people often come to you for advice or to resolve group conflicts?', question_type: 'rating_scale', category: 'interpersonal', weight: 1.0, order_index: 10, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you adapt your communication style based on who you\'re speaking with?', question_type: 'rating_scale', category: 'interpersonal', weight: 1.0, order_index: 11, is_active: true },
      
      // Intrapersonal
      { test_type_id: dominantTestType?.id, question_text: 'Do you find yourself journaling or reflecting on why you feel a certain way?', question_type: 'rating_scale', category: 'intrapersonal', weight: 1.0, order_index: 12, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you prefer figuring out things on your own before discussing with others?', question_type: 'rating_scale', category: 'intrapersonal', weight: 1.0, order_index: 13, is_active: true },
      
      // Communication
      { test_type_id: dominantTestType?.id, question_text: 'Do you enjoy group presentations, storytelling, or persuading others with ideas?', question_type: 'rating_scale', category: 'communication', weight: 1.0, order_index: 14, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you notice subtle body language cues or tone shifts in conversations?', question_type: 'rating_scale', category: 'communication', weight: 1.0, order_index: 15, is_active: true },
      
      // Musical
      { test_type_id: dominantTestType?.id, question_text: 'Do you remember things better when there\'s rhythm, rhyme, or music involved?', question_type: 'rating_scale', category: 'musical', weight: 1.0, order_index: 16, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you often tap your fingers or hum while thinking deeply?', question_type: 'rating_scale', category: 'musical', weight: 1.0, order_index: 17, is_active: true },
      
      // Bodily-Kinesthetic
      { test_type_id: dominantTestType?.id, question_text: 'Do you find it easier to understand concepts when you\'re building or moving?', question_type: 'rating_scale', category: 'bodily-kinesthetic', weight: 1.0, order_index: 18, is_active: true },
      { test_type_id: dominantTestType?.id, question_text: 'Do you learn better through doing (labs, demos, tinkering) than reading?', question_type: 'rating_scale', category: 'bodily-kinesthetic', weight: 1.0, order_index: 19, is_active: true },
      
      // Naturalistic
      { test_type_id: dominantTestType?.id, question_text: 'Do you feel drawn to understanding how natural systems (like ecosystems or machines) work?', question_type: 'rating_scale', category: 'naturalistic', weight: 1.0, order_index: 20, is_active: true },
      
      // Creative
      { test_type_id: dominantTestType?.id, question_text: 'Do you enjoy brainstorming wild ideas or exploring abstract \'what ifs\'?', question_type: 'rating_scale', category: 'creative', weight: 1.0, order_index: 21, is_active: true },

      // Personality Pattern Questions (8 questions as per migration)
      { test_type_id: personalityTestType?.id, question_text: 'When you\'re drained, do you recharge by being alone or with friends?', question_type: 'multiple_choice', category: 'introvert-extrovert', weight: 1.0, order_index: 1, options: [{"text": "Being alone", "value": "introvert", "category": "introvert"}, {"text": "With friends", "value": "extrovert", "category": "extrovert"}], is_active: true },
      { test_type_id: personalityTestType?.id, question_text: 'Do you prefer deep 1-on-1 conversations or group brainstorming?', question_type: 'multiple_choice', category: 'introvert-extrovert', weight: 1.0, order_index: 2, options: [{"text": "1-on-1 conversations", "value": "introvert", "category": "introvert"}, {"text": "Group brainstorming", "value": "extrovert", "category": "extrovert"}], is_active: true },
      { test_type_id: personalityTestType?.id, question_text: 'In tough decisions, do you trust logic more or gut feelings?', question_type: 'multiple_choice', category: 'thinker-feeler', weight: 1.0, order_index: 3, options: [{"text": "Logic", "value": "thinker", "category": "thinker"}, {"text": "Gut feelings", "value": "feeler", "category": "feeler"}], is_active: true },
      { test_type_id: personalityTestType?.id, question_text: 'Do you prioritize being right or being kind?', question_type: 'multiple_choice', category: 'thinker-feeler', weight: 1.0, order_index: 4, options: [{"text": "Being right", "value": "thinker", "category": "thinker"}, {"text": "Being kind", "value": "feeler", "category": "feeler"}], is_active: true },
      { test_type_id: personalityTestType?.id, question_text: 'Do you like planning every detail or going with the flow?', question_type: 'multiple_choice', category: 'planner-flexible', weight: 1.0, order_index: 5, options: [{"text": "Planning every detail", "value": "planner", "category": "planner"}, {"text": "Going with the flow", "value": "flexible", "category": "flexible"}], is_active: true },
      { test_type_id: personalityTestType?.id, question_text: 'Are deadlines energizing or overwhelming for you?', question_type: 'multiple_choice', category: 'planner-flexible', weight: 1.0, order_index: 6, options: [{"text": "Energizing", "value": "planner", "category": "planner"}, {"text": "Overwhelming", "value": "flexible", "category": "flexible"}], is_active: true },
      { test_type_id: personalityTestType?.id, question_text: 'Do you focus on what\'s proven or what\'s possible?', question_type: 'multiple_choice', category: 'practical-imaginative', weight: 1.0, order_index: 7, options: [{"text": "What's proven", "value": "practical", "category": "practical"}, {"text": "What's possible", "value": "imaginative", "category": "imaginative"}], is_active: true },
      { test_type_id: personalityTestType?.id, question_text: 'Do you love fixing what\'s broken or dreaming what\'s not yet built?', question_type: 'multiple_choice', category: 'practical-imaginative', weight: 1.0, order_index: 8, options: [{"text": "Fixing what's broken", "value": "practical", "category": "practical"}, {"text": "Dreaming what's not yet built", "value": "imaginative", "category": "imaginative"}], is_active: true },

      // VARK Learning Style Questions (5 questions as per migration)
      { test_type_id: varkTestType?.id, question_text: 'When learning a new software tool, what helps you most?', question_type: 'multiselect', category: 'mixed', weight: 1.0, order_index: 1, options: [{"text": "Watching a demo", "value": "visual", "category": "v"}, {"text": "Listening to explanation", "value": "auditory", "category": "a"}, {"text": "Reading manual", "value": "reading", "category": "r"}, {"text": "Trying it hands-on", "value": "kinesthetic", "category": "k"}], is_active: true },
      { test_type_id: varkTestType?.id, question_text: 'How do you revise for exams?', question_type: 'multiselect', category: 'mixed', weight: 1.0, order_index: 2, options: [{"text": "Diagrams/maps", "value": "visual", "category": "v"}, {"text": "Recorded lectures", "value": "auditory", "category": "a"}, {"text": "Rewriting notes", "value": "reading", "category": "r"}, {"text": "Building models/testing code", "value": "kinesthetic", "category": "k"}], is_active: true },
      { test_type_id: varkTestType?.id, question_text: 'When stuck on a concept…', question_type: 'multiselect', category: 'mixed', weight: 1.0, order_index: 3, options: [{"text": "Find a visual", "value": "visual", "category": "v"}, {"text": "Call a friend", "value": "auditory", "category": "a"}, {"text": "Re-read notes", "value": "reading", "category": "r"}, {"text": "Rebuild from scratch", "value": "kinesthetic", "category": "k"}], is_active: true },
      { test_type_id: varkTestType?.id, question_text: 'To explain something complex to others…', question_type: 'multiselect', category: 'mixed', weight: 1.0, order_index: 4, options: [{"text": "Draw it out", "value": "visual", "category": "v"}, {"text": "Explain verbally", "value": "auditory", "category": "a"}, {"text": "Write a step-by-step guide", "value": "reading", "category": "r"}, {"text": "Show a prototype or example", "value": "kinesthetic", "category": "k"}], is_active: true },
      { test_type_id: varkTestType?.id, question_text: 'Which of these is most like you?', question_type: 'multiselect', category: 'mixed', weight: 1.0, order_index: 5, options: [{"text": "I think in images", "value": "visual", "category": "v"}, {"text": "I replay conversations in my head", "value": "auditory", "category": "a"}, {"text": "I make lists", "value": "reading", "category": "r"}, {"text": "I build things to understand", "value": "kinesthetic", "category": "k"}], is_active: true }
    ]

    // Insert questions
    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('questions')
      .insert(questions)
      .select()

    if (questionsError) {
      console.error('Error inserting questions:', questionsError)
      throw questionsError
    }

    console.log(`Inserted ${insertedQuestions.length} questions`)

    return NextResponse.json({
      message: 'Database seeded successfully',
      testTypes: testTypes.length,
      questions: insertedQuestions.length,
      data: {
        testTypes,
        questionCounts: {
          'dominant-intelligence': 21, // Updated count from migration file
          'personality-pattern': 8,    // Updated count from migration file  
          'vark': 5                    // Updated count from migration file
        }
      }
    })

  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error },
      { status: 500 }
    )
  }
}
