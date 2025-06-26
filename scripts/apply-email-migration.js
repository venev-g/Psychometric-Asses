// scripts/apply-email-migration.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyEmailMigration() {
  console.log('Applying email column migration...')
  
  try {
    // Check if email column already exists
    const { data: columns, error: columnsError } = await supabase
      .rpc('sql', {
        query: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
          AND column_name = 'email';
        `
      })

    if (columnsError) {
      console.error('Error checking columns:', columnsError)
      return
    }

    if (columns && columns.length > 0) {
      console.log('Email column already exists in user_profiles table')
      return
    }

    // Add email column
    const { error: alterError } = await supabase
      .rpc('sql', {
        query: `
          ALTER TABLE public.user_profiles 
          ADD COLUMN email TEXT;
          
          CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
          ON public.user_profiles(email);
        `
      })

    if (alterError) {
      console.error('Error adding email column:', alterError)
      return
    }

    console.log('Email column added successfully to user_profiles table')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

applyEmailMigration()
