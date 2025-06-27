export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessment_results: {
        Row: {
          created_at: string | null
          id: string
          percentile_ranks: Json | null
          processed_scores: Json
          raw_scores: Json
          recommendations: Json | null
          session_id: string | null
          test_type_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          percentile_ranks?: Json | null
          processed_scores: Json
          raw_scores: Json
          recommendations?: Json | null
          session_id?: string | null
          test_type_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          percentile_ranks?: Json | null
          processed_scores?: Json
          raw_scores?: Json
          recommendations?: Json | null
          session_id?: string | null
          test_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "test_types"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sessions: {
        Row: {
          completed_at: string | null
          configuration_id: string | null
          current_test_index: number | null
          id: string
          metadata: Json | null
          started_at: string | null
          status: string | null
          total_tests: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          configuration_id?: string | null
          current_test_index?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string | null
          total_tests?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          configuration_id?: string | null
          current_test_index?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string | null
          total_tests?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_sessions_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "test_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          options: Json | null
          order_index: number | null
          question_text: string
          question_type: string
          subcategory: string | null
          test_type_id: string | null
          weight: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text: string
          question_type: string
          subcategory?: string | null
          test_type_id?: string | null
          weight?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text?: string
          question_type?: string
          subcategory?: string | null
          test_type_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "test_types"
            referencedColumns: ["id"]
          },
        ]
      }
      test_configurations: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          max_attempts: number | null
          name: string
          time_limit_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_attempts?: number | null
          name: string
          time_limit_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_attempts?: number | null
          name?: string
          time_limit_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      test_sequences: {
        Row: {
          configuration_id: string | null
          created_at: string | null
          id: string
          is_required: boolean | null
          sequence_order: number
          test_type_id: string | null
        }
        Insert: {
          configuration_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          sequence_order: number
          test_type_id?: string | null
        }
        Update: {
          configuration_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          sequence_order?: number
          test_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_sequences_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "test_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sequences_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "test_types"
            referencedColumns: ["id"]
          },
        ]
      }
      test_types: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_duration_minutes: number | null
          id: string
          instructions: string | null
          is_active: boolean | null
          name: string
          scoring_algorithm: Json | null
          slug: string
          version: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name: string
          scoring_algorithm?: Json | null
          slug: string
          version?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name?: string
          scoring_algorithm?: Json | null
          slug?: string
          version?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          response_time_ms: number | null
          response_value: Json
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_time_ms?: number | null
          response_value: Json
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_time_ms?: number | null
          response_value?: Json
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
