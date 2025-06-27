#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  try {
    console.log('🔧 Applying RLS security migration...')
    
    const migrationPath = path.join(__dirname, '../migrations/001_enable_rls.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    })
    
    if (error) {
      console.error('❌ Migration failed:', error)
      return false
    }
    
    console.log('✅ RLS security migration applied successfully')
    return true
    
  } catch (error) {
    console.error('❌ Error applying migration:', error)
    return false
  }
}

// Direct SQL execution since rpc might not exist
async function applyMigrationDirect() {
  try {
    console.log('🔧 Applying RLS security migration via direct SQL...')
    
    const migrationPath = path.join(__dirname, '../migrations/001_enable_rls.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    for (const [index, statement] of statements.entries()) {
      if (statement.trim()) {
        console.log(`   ${index + 1}. ${statement.substring(0, 50)}...`)
        const { data, error } = await supabase.from('_').select('*').limit(0) // This will fail but we can use it to execute SQL
        
        // Since we can't execute arbitrary SQL directly, let's try a different approach
        console.log(`   ⚠️  Cannot execute SQL directly via supabase-js client`)
        break
      }
    }
    
    console.log('ℹ️  Migration needs to be applied via Supabase dashboard or CLI')
    console.log('📋 Copy the SQL from migrations/001_enable_rls.sql to Supabase SQL Editor')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  applyMigrationDirect()
}

module.exports = { applyMigration, applyMigrationDirect }
