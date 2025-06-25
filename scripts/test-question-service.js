// scripts/test-question-service.js
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase connection setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple implementation of QuestionsService's functionality
async function getQuestionsByTestType(testTypeSlug) {
  console.log(`Fetching questions for test type: ${testTypeSlug}`);
  
  // First get the test type ID
  const { data: testTypes, error: testTypeError } = await supabase
    .from('test_types')
    .select('id, name')
    .eq('slug', testTypeSlug)
    .eq('is_active', true);

  if (testTypeError) {
    console.error(`Error fetching test type for slug ${testTypeSlug}:`, testTypeError);
    throw testTypeError;
  }
  
  if (!testTypes || testTypes.length === 0) {
    console.error(`Test type with slug '${testTypeSlug}' not found`);
    throw new Error(`Test type with slug '${testTypeSlug}' not found`);
  }

  const testType = testTypes[0];
  console.log(`Found test type: ${testType.name} (${testType.id})`);

  // Then get questions for this test type
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('test_type_id', testType.id)
    .or('is_active.is.null,is_active.eq.true')
    .order('order_index');

  if (error) {
    console.error(`Error fetching questions for test type ${testType.name}:`, error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} questions for ${testType.name}`);
  return data || [];
}

async function getAllQuestionsForAssessment() {
  try {
    console.log('Fetching all questions for assessment...');
    // Fetch questions for all test types
    const [dominantQuestions, personalityQuestions, learningQuestions] = await Promise.all([
      getQuestionsByTestType('dominant-intelligence'),
      getQuestionsByTestType('personality-pattern'),
      getQuestionsByTestType('vark')
    ]);

    console.log(`Dominant questions: ${dominantQuestions.length}`);
    console.log(`Personality questions: ${personalityQuestions.length}`);
    console.log(`Learning questions: ${learningQuestions.length}`);

    return {
      dominantIntelligence: dominantQuestions,
      personalityPattern: personalityQuestions,
      learningStyle: learningQuestions
    };
  } catch (error) {
    console.error('Failed to fetch questions from database:', error);
    throw error;
  }
}

// Test the questions service
getAllQuestionsForAssessment()
  .then(result => {
    console.log('\n✅ Successfully fetched all questions!');
    
    // Print sample questions from each category
    if (result.dominantIntelligence.length > 0) {
      const sample = result.dominantIntelligence[0];
      console.log('\nSample Dominant Intelligence question:');
      console.log(`- Question: ${sample.question_text}`);
      console.log(`- Type: ${sample.question_type}`);
      console.log(`- Category: ${sample.category}`);
    }
    
    if (result.personalityPattern.length > 0) {
      const sample = result.personalityPattern[0];
      console.log('\nSample Personality Pattern question:');
      console.log(`- Question: ${sample.question_text}`);
      console.log(`- Type: ${sample.question_type}`);
      console.log(`- Options:`, sample.options);
    }
    
    if (result.learningStyle.length > 0) {
      const sample = result.learningStyle[0];
      console.log('\nSample Learning Style question:');
      console.log(`- Question: ${sample.question_text}`);
      console.log(`- Type: ${sample.question_type}`);
      console.log(`- Options:`, sample.options);
    }
  })
  .catch(error => {
    console.error('Error testing question service:', error);
  });
