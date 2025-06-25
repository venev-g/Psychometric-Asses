// scripts/migrate-database.ts
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: './.env.local' })

// Supabase connection setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials in .env.local file')
  console.log('Required environment variables:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

// Get all SQL migration files
const migrationDir = path.join(__dirname, '../supabase/migrations')
const migrationFiles = fs.readdirSync(migrationDir)
  .filter(file => file.endsWith('.sql'))
  .sort() // Ensure files are processed in order

async function applyMigrations() {
  console.log('Starting migration process...')
  
  for (const file of migrationFiles) {
    console.log(`Processing migration: ${file}`)
    
    const filePath = path.join(migrationDir, file)
    const sql = fs.readFileSync(filePath, 'utf8')
    
    try {
      // Execute the SQL using the Supabase client
      // Note: You need to create a stored procedure in your Supabase project for this to work
      const { error } = await supabase.rpc('exec_sql', { sql })
      
      if (error) {
        console.error(`Error applying migration ${file}:`, error)
        
        // Fallback: Try using the REST API to execute SQL (requires proper permissions)
        console.log('Trying alternative execution method...')
        const { error: restError } = await supabase.from('_exec_sql').select('*').eq('sql', sql).single()
        
        if (restError) {
          console.error('Alternative method also failed:', restError)
          return
        }
      }
      
      console.log(`✅ Successfully applied migration: ${file}`)
    } catch (error) {
      console.error(`Error in migration ${file}:`, error)
      return
    }
  }
  
  console.log('All migrations completed successfully!')
}

// Run the migration process
applyMigrations()
  .catch(error => {
    console.error('Migration process failed:', error)
    process.exit(1)
  })
