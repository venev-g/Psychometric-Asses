// scripts/apply-migrations.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

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
    console.log(`Processing migration: ${file}`);
    
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      // Execute the SQL using the Supabase client
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Error applying migration ${file}:`, error);
        return;
      }
      
      console.log(`✅ Successfully applied migration: ${file}`);
    } catch (error) {
      console.error(`Error in migration ${file}:`, error);
      return;
    }
  }
  
  console.log('All migrations completed successfully!');
}

// Run the migration process
applyMigrations()
  .catch(error => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });
