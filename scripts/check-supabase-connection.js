// scripts/check-supabase-connection.js
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkSupabaseConnection() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing required Supabase credentials in .env.local');
      console.log('Required environment variables:');
      console.log('- NEXT_PUBLIC_SUPABASE_URL');
      console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('Optional (needed for migrations):');
      console.log('- SUPABASE_SERVICE_ROLE_KEY');
      return false;
    }

    console.log('✅ Found Supabase environment variables');
    
    // Try connecting using the anon key
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.from('test_types').select('count').single();
    
    if (error) {
      console.error('❌ Failed to connect to Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase database');
    console.log('Connection is properly configured!');
    
    // Check if service role key is valid (for admin operations)
    if (serviceRoleKey) {
      console.log('Testing service role key...');
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      const { error: adminError } = await adminClient.from('test_types').select('count').single();
      
      if (adminError) {
        console.warn('⚠️ Service role key may not be valid:', adminError.message);
      } else {
        console.log('✅ Service role key is valid');
      }
    } else {
      console.warn('⚠️ No service role key provided. Admin operations may not work.');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

checkSupabaseConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Failed to check Supabase connection:', err);
    process.exit(1);
  });
