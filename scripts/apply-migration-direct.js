// scripts/apply-migration-direct.js
import pg from 'pg'

const { Client } = pg

// Parse the DATABASE_URL
const client = new Client({
  host: 'db.sayftcijqhnpzlznvqcz.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '2nFm6DUn#ccDe2H',
  ssl: { rejectUnauthorized: false }
})

async function applyMigration() {
  try {
    await client.connect()
    console.log('Connected to database')

    // Check if email column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' 
      AND column_name = 'email'
    `)

    if (checkResult.rows.length > 0) {
      console.log('Email column already exists in user_profiles table')
      return
    }

    // Add email column
    await client.query(`
      ALTER TABLE public.user_profiles 
      ADD COLUMN email TEXT
    `)

    // Add index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
      ON public.user_profiles(email)
    `)

    console.log('Successfully added email column to user_profiles table')

  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await client.end()
  }
}

applyMigration()
