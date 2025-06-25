// scripts/test-personality-questions.js
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

// Simple implementation to test the personality questions specifically
async function testPersonalityQuestions() {
  console.log('Fetching Personality Pattern questions...');
  
  // Get the personality pattern test type ID
  const { data: testTypes, error: testTypeError } = await supabase
    .from('test_types')
    .select('id, name')
    .eq('slug', 'personality-pattern');

  if (testTypeError) {
    console.error('Error fetching personality test type:', testTypeError);
    return;
  }
  
  if (!testTypes || testTypes.length === 0) {
    console.error('Personality Pattern test type not found');
    return;
  }

  const testType = testTypes[0];
  console.log(`Found test type: ${testType.name} (${testType.id})`);

  // Get questions for personality pattern
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('test_type_id', testType.id)
    .or('is_active.is.null,is_active.eq.true');

  if (error) {
    console.error('Error fetching personality questions:', error);
    return;
  }
  
  console.log(`Retrieved ${questions?.length || 0} personality questions`);
  
  // Check that they have the correct question type and options structure
  questions.forEach((q, i) => {
    console.log(`\nQuestion ${i+1}: ${q.question_text}`);
    console.log(`Type: ${q.question_type}`);
    
    if (q.question_type !== 'multiple_choice') {
      console.error(`❌ ERROR: Personality questions should be multiple_choice, but found ${q.question_type}`);
    }
    
    if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
      console.error('❌ ERROR: No options found for this question');
    } else {
      console.log('Options:');
      q.options.forEach((opt, j) => {
        if (typeof opt === 'object' && opt.text && opt.value) {
          console.log(`  ${j+1}. ${opt.text} (value: ${opt.value})`);
        } else {
          console.error(`❌ ERROR: Option ${j+1} has invalid format:`, opt);
        }
      });
    }
  });
  
  console.log('\nNow fetching VARK questions...');
  
  // Get the VARK test type ID
  const { data: varkTestTypes, error: varkTestTypeError } = await supabase
    .from('test_types')
    .select('id, name')
    .eq('slug', 'vark');

  if (varkTestTypeError) {
    console.error('Error fetching VARK test type:', varkTestTypeError);
    return;
  }
  
  if (!varkTestTypes || varkTestTypes.length === 0) {
    console.error('VARK test type not found');
    return;
  }

  const varkTestType = varkTestTypes[0];
  console.log(`Found test type: ${varkTestType.name} (${varkTestType.id})`);

  // Get questions for VARK
  const { data: varkQuestions, error: varkError } = await supabase
    .from('questions')
    .select('*')
    .eq('test_type_id', varkTestType.id)
    .or('is_active.is.null,is_active.eq.true');

  if (varkError) {
    console.error('Error fetching VARK questions:', varkError);
    return;
  }
  
  console.log(`Retrieved ${varkQuestions?.length || 0} VARK questions`);
  
  // Check that they have the correct question type and options structure
  varkQuestions.forEach((q, i) => {
    console.log(`\nQuestion ${i+1}: ${q.question_text}`);
    console.log(`Type: ${q.question_type}`);
    
    if (q.question_type !== 'multiselect') {
      console.error(`❌ ERROR: VARK questions should be multiselect, but found ${q.question_type}`);
    }
    
    if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
      console.error('❌ ERROR: No options found for this question');
    } else {
      console.log('Options:');
      q.options.forEach((opt, j) => {
        if (typeof opt === 'object' && opt.text && opt.value) {
          console.log(`  ${j+1}. ${opt.text} (value: ${opt.value})`);
        } else {
          console.error(`❌ ERROR: Option ${j+1} has invalid format:`, opt);
        }
      });
    }
  });
}

testPersonalityQuestions().catch(console.error);
