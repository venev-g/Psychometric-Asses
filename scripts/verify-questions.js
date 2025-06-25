// scripts/verify-questions.js
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase connection setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials in .env.local file');
  console.log('Required environment variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function verifyQuestions() {
  console.log('Verifying questions in the database...');
  
  try {
    // Get all test types
    const { data: testTypes, error: testTypesError } = await supabase
      .from('test_types')
      .select('*');
    
    if (testTypesError) {
      console.error('Error fetching test types:', testTypesError);
      return false;
    }
    
    console.log(`Found ${testTypes.length} test types`);
    
    // Check questions for each test type
    for (const testType of testTypes) {
      console.log(`\n⚠️ Checking questions for: ${testType.name} (slug: ${testType.slug})`);
      
      // Get questions with is_active = true
      const { data: activeQuestions, error: activeError } = await supabase
        .from('questions')
        .select('*')
        .eq('test_type_id', testType.id)
        .eq('is_active', true);
      
      if (activeError) {
        console.error(`Error fetching active questions for ${testType.name}:`, activeError);
        continue;
      }
      
      // Get questions with is_active = null
      const { data: nullQuestions, error: nullError } = await supabase
        .from('questions')
        .select('*')
        .eq('test_type_id', testType.id)
        .is('is_active', null);
      
      if (nullError) {
        console.error(`Error fetching null questions for ${testType.name}:`, nullError);
        continue;
      }
      
      console.log(`Questions with is_active=true: ${activeQuestions.length}`);
      console.log(`Questions with is_active=null: ${nullQuestions.length}`);
      
      // If null questions exist, recommend updating them
      if (nullQuestions.length > 0) {
        console.log(`\n⚠️ Found ${nullQuestions.length} questions with is_active=null for ${testType.name}`);
        console.log('These questions will be included in results because of the OR condition in the query');
        console.log('But it\'s recommended to run the 005_activate_questions.sql migration to set them all to active');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying questions:', error);
    return false;
  }
}

verifyQuestions()
  .then(success => {
    if (!success) {
      console.log('❌ Question verification failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error during question verification:', error);
    process.exit(1);
  });
