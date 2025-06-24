// src/types/database.types.ts
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      test_configurations: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          max_attempts: number | null
          time_limit_minutes: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          max_attempts?: number | null
          time_limit_minutes?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          max_attempts?: number | null
          time_limit_minutes?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      test_types: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          version: string
          is_active: boolean
          scoring_algorithm: any
          instructions: string | null
          estimated_duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          version?: string
          is_active?: boolean
          scoring_algorithm?: any
          instructions?: string | null
          estimated_duration_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          version?: string
          is_active?: boolean
          scoring_algorithm?: any
          instructions?: string | null
          estimated_duration_minutes?: number
          created_at?: string
        }
      }
      test_sequences: {
        Row: {
          id: string
          configuration_id: string
          test_type_id: string
          sequence_order: number
          is_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          configuration_id: string
          test_type_id: string
          sequence_order: number
          is_required?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          configuration_id?: string
          test_type_id?: string
          sequence_order?: number
          is_required?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          test_type_id: string
          question_text: string
          question_type: 'multiple_choice' | 'rating_scale' | 'yes_no' | 'multiselect'
          options: any
          category: string | null
          subcategory: string | null
          weight: number
          is_active: boolean
          order_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          test_type_id: string
          question_text: string
          question_type: 'multiple_choice' | 'rating_scale' | 'yes_no' | 'multiselect'
          options?: any
          category?: string | null
          subcategory?: string | null
          weight?: number
          is_active?: boolean
          order_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          test_type_id?: string
          question_text?: string
          question_type?: 'multiple_choice' | 'rating_scale' | 'yes_no' | 'multiselect'
          options?: any
          category?: string | null
          subcategory?: string | null
          weight?: number
          is_active?: boolean
          order_index?: number | null
          created_at?: string
        }
      }
      assessment_sessions: {
        Row: {
          id: string
          user_id: string
          configuration_id: string
          status: 'started' | 'in_progress' | 'completed' | 'abandoned'
          current_test_index: number
          total_tests: number
          started_at: string
          completed_at: string | null
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          configuration_id: string
          status?: 'started' | 'in_progress' | 'completed' | 'abandoned'
          current_test_index?: number
          total_tests?: number
          started_at?: string
          completed_at?: string | null
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          configuration_id?: string
          status?: 'started' | 'in_progress' | 'completed' | 'abandoned'
          current_test_index?: number
          total_tests?: number
          started_at?: string
          completed_at?: string | null
          metadata?: any
        }
      }
      user_responses: {
        Row: {
          id: string
          session_id: string
          question_id: string
          response_value: any
          response_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          response_value: any
          response_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          response_value?: any
          response_time_ms?: number | null
          created_at?: string
        }
      }
      assessment_results: {
        Row: {
          id: string
          session_id: string
          test_type_id: string
          raw_scores: any
          processed_scores: any
          recommendations: any
          percentile_ranks: any
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          test_type_id: string
          raw_scores: any
          processed_scores: any
          recommendations?: any
          percentile_ranks?: any
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          test_type_id?: string
          raw_scores?: any
          processed_scores?: any
          recommendations?: any
          percentile_ranks?: any
          created_at?: string
        }
      }
    }
  }
}