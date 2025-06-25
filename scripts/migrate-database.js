// scripts/migrate-database.js
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

// Get all SQL migration files
const migrationDir = path.join(__dirname, '../supabase/migrations');
const migrationFiles = fs.readdirSync(migrationDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // Ensure files are processed in order

async function applyMigrations() {
  console.log('Starting migration process...');
  
  for (const file of migrationFiles) {
    console.log(`\n📝 Processing migration: ${file}`);
    
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      console.log(`Executing SQL from ${file}...`);
      console.log('-'.repeat(50));
      console.log(sql.substring(0, 200) + (sql.length > 200 ? '...' : ''));
      console.log('-'.repeat(50));

      // Use Supabase's REST API to run SQL directly
      // This requires proper permissions and may not work in all environments
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Error applying migration ${file}:`, error);
        
        if (error.message.includes('function "exec_sql" does not exist')) {
          console.log('\nℹ️ The exec_sql function does not exist in your Supabase project.');
          console.log('You may need to manually apply these migrations using the Supabase dashboard SQL editor.');
          console.log(`File to apply: ${filePath}`);
        }
        
        const continuePrompt = await askToContinue();
        if (!continuePrompt) {
          return;
        }
      } else {
        console.log(`✅ Successfully applied migration: ${file}`);
      }
    } catch (error) {
      console.error(`Error in migration ${file}:`, error);
      
      const continuePrompt = await askToContinue();
      if (!continuePrompt) {
        return;
      }
    }
  }
  
  console.log('\n✅ Migration process completed!');
  console.log('Note: You should verify that all migrations were applied correctly.');
}

// Simple function to ask user if they want to continue after an error
async function askToContinue() {
  console.log('\nContinue with next migration? [Y/n]');
  
  // In a real implementation, you'd use readline or another module to get user input
  // For this example, we'll just continue automatically
  console.log('Automatically continuing...');
  return true;
}

// Run the migration process
applyMigrations()
  .catch(error => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });
