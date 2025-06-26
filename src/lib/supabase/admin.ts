// Service role client for admin operations
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Create admin client that bypasses RLS
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export { supabaseAdmin }

// Helper functions for admin operations
export const adminOperations = {
  // Create admin user
  async createAdminUser(email: string, password: string, userData?: any) {
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          ...userData
        }
      })
      
      if (authError) throw authError

      // Insert into user_profiles table with admin role
      const { error: userError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email,
          role: 'admin',
          full_name: userData?.full_name || 'Admin User',
          created_at: new Date().toISOString()
        })
      
      if (userError) throw userError
      
      return { success: true, user: authData.user }
    } catch (error) {
      console.error('Error creating admin user:', error)
      return { success: false, error }
    }
  },

  // Seed test configurations
  async seedTestConfigurations() {
    try {
      const configurations = [
        {
          id: 'config-dominant-intelligence',
          test_type_id: '7c8d2f56-3b83-4930-800a-5a50940c98ec',
          name: 'Standard Intelligence Assessment Configuration',
          description: 'Default configuration for multiple intelligence assessment',
          settings: {
            time_limit_minutes: 15,
            randomize_questions: false,
            show_progress: true,
            require_all_questions: true
          },
          question_sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'config-personality-pattern',
          test_type_id: '66dc483d-6a2c-42ec-8ce3-751b17becbfe',
          name: 'Standard Personality Assessment Configuration',
          description: 'Default configuration for DISC personality assessment',
          settings: {
            time_limit_minutes: 12,
            randomize_questions: false,
            show_progress: true,
            require_all_questions: true
          },
          question_sequence: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68],
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'config-vark',
          test_type_id: '31ec4fc1-e033-4276-bb47-cac323548f7c',
          name: 'Standard VARK Learning Style Configuration',
          description: 'Default configuration for VARK learning style assessment',
          settings: {
            time_limit_minutes: 10,
            randomize_questions: false,
            show_progress: true,
            require_all_questions: true
          },
          question_sequence: [69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]

      const { error } = await supabaseAdmin
        .from('test_configurations')
        .upsert(configurations, { onConflict: 'id' })
      
      if (error) throw error
      
      return { success: true, configurations }
    } catch (error) {
      console.error('Error seeding test configurations:', error)
      return { success: false, error }
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return { success: true, users: data }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { success: false, error }
    }
  },

  // Check if admin exists
  async checkAdminExists() {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('id, email, role')
        .eq('role', 'admin')
        .limit(1)
      
      if (error) throw error
      
      return { success: true, hasAdmin: data && data.length > 0, admin: data?.[0] }
    } catch (error) {
      console.error('Error checking admin:', error)
      return { success: false, error }
    }
  }
}
