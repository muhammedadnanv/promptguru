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
      flows: {
        Row: {
          created_at: string
          flow_steps: Json
          id: string
          is_active: boolean | null
          name: string
          social_account_id: string
          trigger_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          flow_steps: Json
          id?: string
          is_active?: boolean | null
          name: string
          social_account_id: string
          trigger_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          flow_steps?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          social_account_id?: string
          trigger_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flows_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flows_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          last_contact: string | null
          location: string | null
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          last_contact?: string | null
          location?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          last_contact?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      message_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          flow_id: string | null
          id: string
          message_queue_id: string
          trigger_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          flow_id?: string | null
          id?: string
          message_queue_id: string
          trigger_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          flow_id?: string | null
          id?: string
          message_queue_id?: string
          trigger_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_analytics_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_analytics_message_queue_id_fkey"
            columns: ["message_queue_id"]
            isOneToOne: false
            referencedRelation: "message_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_analytics_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      message_queue: {
        Row: {
          created_at: string
          error_message: string | null
          flow_id: string | null
          id: string
          message_content: string
          platform_message_id: string | null
          recipient_id: string
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          social_account_id: string
          status: string | null
          trigger_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          flow_id?: string | null
          id?: string
          message_content: string
          platform_message_id?: string | null
          recipient_id: string
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          social_account_id: string
          status?: string | null
          trigger_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          flow_id?: string | null
          id?: string
          message_content?: string
          platform_message_id?: string | null
          recipient_id?: string
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          social_account_id?: string
          status?: string | null
          trigger_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_queue_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_queue_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_queue_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          duration: string | null
          id: string
          order_id: string | null
          payment_id: string
          program_title: string
          signature: string | null
          status: string | null
          user_email: string
          user_name: string
          user_phone: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          duration?: string | null
          id?: string
          order_id?: string | null
          payment_id: string
          program_title: string
          signature?: string | null
          status?: string | null
          user_email: string
          user_name: string
          user_phone: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          duration?: string | null
          id?: string
          order_id?: string | null
          payment_id?: string
          program_title?: string
          signature?: string | null
          status?: string | null
          user_email?: string
          user_name?: string
          user_phone?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          content: string
          created_at: string | null
          framework: string
          id: string
          model: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          framework: string
          id?: string
          model: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          framework?: string
          id?: string
          model?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_email: string
          referrer_email: string
          reward_amount: number
          reward_type: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_email: string
          referrer_email: string
          reward_amount: number
          reward_type: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string
          referrer_email?: string
          reward_amount?: number
          reward_type?: string
          status?: string | null
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          category: string
          created_at: string
          id: string
          keyword: string
          last_used_at: string | null
          relevance_score: number
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          keyword: string
          last_used_at?: string | null
          relevance_score?: number
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          keyword?: string
          last_used_at?: string | null
          relevance_score?: number
          usage_count?: number | null
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          access_token: string
          account_type: string | null
          created_at: string
          id: string
          is_active: boolean | null
          permissions: string[] | null
          platform: string
          platform_account_id: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
          username: string
          webhook_verified: boolean | null
        }
        Insert: {
          access_token: string
          account_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: string[] | null
          platform: string
          platform_account_id: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
          username: string
          webhook_verified?: boolean | null
        }
        Update: {
          access_token?: string
          account_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: string[] | null
          platform?: string
          platform_account_id?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          webhook_verified?: boolean | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          created_at: string
          id: string
          name: string
          program: string
          quote: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          program: string
          quote: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          program?: string
          quote?: string
        }
        Relationships: []
      }
      transformations: {
        Row: {
          created_at: string | null
          id: string
          model_used: string
          processing_time: number | null
          prompt_id: string
          provider: string
          transformed_content: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          model_used: string
          processing_time?: number | null
          prompt_id: string
          provider: string
          transformed_content: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          model_used?: string
          processing_time?: number | null
          prompt_id?: string
          provider?: string
          transformed_content?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transformations_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      triggers: {
        Row: {
          created_at: string
          dm_template: string
          id: string
          is_active: boolean | null
          name: string
          social_account_id: string
          target_posts: string[] | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dm_template: string
          id?: string
          is_active?: boolean | null
          name: string
          social_account_id: string
          target_posts?: string[] | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dm_template?: string
          id?: string
          is_active?: boolean | null
          name?: string
          social_account_id?: string
          target_posts?: string[] | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "triggers_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          created_at: string | null
          encrypted_key: string
          id: string
          is_active: boolean | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          encrypted_key: string
          id?: string
          is_active?: boolean | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          encrypted_key?: string
          id?: string
          is_active?: boolean | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          data: Json
          event_type: string
          id: string
          object_id: string
          platform: string
          processed: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          event_type: string
          id?: string
          object_id: string
          platform: string
          processed?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          event_type?: string
          id?: string
          object_id?: string
          platform?: string
          processed?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
