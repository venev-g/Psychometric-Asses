// scripts/verify-and-seed-test-types.js
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase connection setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Required test types
const requiredTypes = [
  {
    name: 'Dominant Intelligence Assessment',
    slug: 'dominant-intelligence',
    description: 'Based on Howard Gardner\'s Theory of Multiple Intelligences, this assessment identifies your strongest intelligence areas.',
    instructions: 'For each statement, rate how accurately it describes you on a scale of 1 to 5.',
    estimated_duration_minutes: 15,
    is_active: true
  },
  {
    name: 'Personality Pattern Assessment',
    slug: 'personality-pattern',
    description: 'Based on personality models, this assessment reveals your behavioral patterns and working style preferences.',
    instructions: 'For each set of words, select the one that best describes you in most situations.',
    estimated_duration_minutes: 12,
    is_active: true
  },
  {
    name: 'VARK Learning Style Assessment',
    slug: 'vark',
    description: 'Discover your learning preferences across Visual, Auditory, Reading/Writing, and Kinesthetic modalities.',
    instructions: 'For each question, select all options that apply to you.',
    estimated_duration_minutes: 10,
    is_active: true
  }
];

// Sample questions to add if no questions are found
const sampleQuestions = [
  // Dominant Intelligence
  { 
    question_text: 'Do you often break things into parts to understand how they work?', 
    question_type: 'rating_scale', 
    category: 'logical-mathematical', 
    test_type_slug: 'dominant-intelligence',
    is_active: true,
    order_index: 1
  },
  { 
    question_text: 'Can you easily visualize how things look from different angles in your mind?', 
    question_type: 'rating_scale', 
    category: 'spatial',
    test_type_slug: 'dominant-intelligence',
    is_active: true,
    order_index: 2
  },
  { 
    question_text: 'Do you enjoy explaining complex ideas with clarity?', 
    question_type: 'rating_scale', 
    category: 'linguistic',
    test_type_slug: 'dominant-intelligence',
    is_active: true,
    order_index: 3
  },
  
  // Personality Pattern
  {
    question_text: 'When you\'re drained, do you recharge by being alone or with friends?',
    question_type: 'multiple_choice',
    category: 'introvert-extrovert',
    test_type_slug: 'personality-pattern',
    is_active: true,
    order_index: 1,
    options: [
      { text: 'Being alone', value: 'introvert', category: 'introvert' },
      { text: 'With friends', value: 'extrovert', category: 'extrovert' }
    ]
  },
  {
    question_text: 'Do you prefer deep 1-on-1 conversations or group brainstorming?',
    question_type: 'multiple_choice',
    category: 'introvert-extrovert',
    test_type_slug: 'personality-pattern',
    is_active: true,
    order_index: 2,
    options: [
      { text: '1-on-1 conversations', value: 'introvert', category: 'introvert' },
      { text: 'Group brainstorming', value: 'extrovert', category: 'extrovert' }
    ]
  },
  
  // VARK Learning Style
  {
    question_text: 'When learning a new software tool, what helps you most?',
    question_type: 'multiselect',
    category: 'mixed',
    test_type_slug: 'vark',
    is_active: true,
    order_index: 1,
    options: [
      { text: 'Watching a demo', value: 'visual', category: 'v' },
      { text: 'Listening to explanation', value: 'auditory', category: 'a' },
      { text: 'Reading manual', value: 'reading', category: 'r' },
      { text: 'Trying it hands-on', value: 'kinesthetic', category: 'k' }
    ]
  }
];

async function verifyAndSeedTestTypes() {
  console.log('Verifying test types in the database...');
  
  try {
    // Check for existing test types
    const { data: existingTypes, error } = await supabase
      .from('test_types')
      .select('*');
    
    if (error) {
      console.error('Error fetching test types:', error);
      return false;
    }
    
    console.log(`Found ${existingTypes.length} existing test types in the database`);
    
    // Check if we need to add any missing test types
    for (const requiredType of requiredTypes) {
      const exists = existingTypes.some(t => t.slug === requiredType.slug);
      
      if (!exists) {
        console.log(`Test type '${requiredType.name}' (${requiredType.slug}) is missing, adding it...`);
        
        const { data: newType, error: insertError } = await supabase
          .from('test_types')
          .insert(requiredType)
          .select()
          .single();
        
        if (insertError) {
          console.error(`Error adding test type ${requiredType.slug}:`, insertError);
        } else {
          console.log(`✅ Added test type: ${newType.name} (${newType.id})`);
        }
      } else {
        console.log(`✅ Test type '${requiredType.name}' (${requiredType.slug}) exists`);
      }
    }
    
    // Now check for questions in each test type
    for (const testType of requiredTypes) {
      // Get the test type ID
      const { data: typeData, error: typeError } = await supabase
        .from('test_types')
        .select('id')
        .eq('slug', testType.slug)
        .single();
      
      if (typeError) {
        console.error(`Error getting ID for test type ${testType.slug}:`, typeError);
        continue;
      }
      
      const testTypeId = typeData.id;
      
      // Check for existing questions
      const { data: questions, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('test_type_id', testTypeId);
      
      if (questionError) {
        console.error(`Error fetching questions for ${testType.name}:`, questionError);
        continue;
      }
      
      console.log(`Found ${questions.length} questions for test type: ${testType.name}`);
      
      // Add sample questions if none exist
      if (questions.length === 0) {
        console.log(`No questions found for ${testType.name}, adding sample questions...`);
        
        const sampleQsForType = sampleQuestions.filter(q => q.test_type_slug === testType.slug);
        
        for (const question of sampleQsForType) {
          // Remove the test_type_slug field and add the test_type_id
          const { test_type_slug, ...questionData } = question;
          questionData.test_type_id = testTypeId;
          
          const { data: newQuestion, error: insertError } = await supabase
            .from('questions')
            .insert(questionData)
            .select()
            .single();
          
          if (insertError) {
            console.error(`Error adding sample question for ${testType.name}:`, insertError);
          } else {
            console.log(`✅ Added sample question: "${questionData.question_text.substring(0, 30)}..."`);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying and seeding test types:', error);
    return false;
  }
}

verifyAndSeedTestTypes()
  .then(success => {
    if (success) {
      console.log('\n✅ Test type verification and seeding completed successfully!');
    } else {
      console.log('\n❌ Test type verification and seeding encountered errors.');
    }
  })
  .catch(error => {
    console.error('Script error:', error);
  });
