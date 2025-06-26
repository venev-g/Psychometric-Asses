// scripts/create-test-user.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'test123456',
      user_metadata: {
        full_name: 'Test User'
      },
      email_confirm: true
    })

    if (authError) {
      console.error('Auth error:', authError)
      return
    }

    console.log('Test user created successfully!')
    console.log('Email: test@example.com')
    console.log('Password: test123456')
    console.log('User ID:', authData.user.id)

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: authData.user.id,
        full_name: 'Test User',
        role: 'user'
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    } else {
      console.log('User profile created successfully!')
    }

  } catch (error) {
    console.error('Error creating test user:', error)
  }
}

createTestUser()
