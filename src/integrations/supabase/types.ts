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
      admin_actions: {
        Row: {
          action_id: string
          action_type: Database["public"]["Enums"]["admin_action_type"]
          admin_id: string | null
          created_at: string | null
          notes: string | null
          target_id: string
        }
        Insert: {
          action_id?: string
          action_type: Database["public"]["Enums"]["admin_action_type"]
          admin_id?: string | null
          created_at?: string | null
          notes?: string | null
          target_id: string
        }
        Update: {
          action_id?: string
          action_type?: Database["public"]["Enums"]["admin_action_type"]
          admin_id?: string | null
          created_at?: string | null
          notes?: string | null
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          applicable_to: Database["public"]["Enums"]["applicable_to"]
          commission_id: string
          commission_type: Database["public"]["Enums"]["commission_type"]
          created_at: string | null
          rate: number
          updated_at: string | null
        }
        Insert: {
          applicable_to: Database["public"]["Enums"]["applicable_to"]
          commission_id?: string
          commission_type: Database["public"]["Enums"]["commission_type"]
          created_at?: string | null
          rate: number
          updated_at?: string | null
        }
        Update: {
          applicable_to?: Database["public"]["Enums"]["applicable_to"]
          commission_id?: string
          commission_type?: Database["public"]["Enums"]["commission_type"]
          created_at?: string | null
          rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount: number
          date_invested: string | null
          investment_id: string
          investor_id: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["investment_status"] | null
        }
        Insert: {
          amount: number
          date_invested?: string | null
          investment_id?: string
          investor_id?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["investment_status"] | null
        }
        Update: {
          amount?: number
          date_invested?: string | null
          investment_id?: string
          investor_id?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["investment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          document_id: string
          document_type: string
          file_path: string
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          document_id?: string
          document_type: string
          file_path: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          document_id?: string
          document_type?: string
          file_path?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          date: string | null
          message: string
          notification_id: string
          read: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          date?: string | null
          message: string
          notification_id?: string
          read?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          date?: string | null
          message?: string
          notification_id?: string
          read?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          national_id: string
          phone: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          national_id: string
          phone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          national_id?: string
          phone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          document_id: string
          document_name: string
          file_path: string
          project_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          document_id?: string
          document_name: string
          file_path: string
          project_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          document_id?: string
          document_name?: string
          file_path?: string
          project_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      project_reviews: {
        Row: {
          created_at: string | null
          notes: string | null
          project_id: string | null
          review_id: string
          reviewer_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          notes?: string | null
          project_id?: string | null
          review_id?: string
          reviewer_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          notes?: string | null
          project_id?: string | null
          review_id?: string
          reviewer_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          amount_raised: number | null
          category: string
          created_at: string | null
          description: string
          end_date: string
          funding_goal: number
          minimum_investment: number
          owner_id: string | null
          project_id: string
          shariah_compliant: boolean | null
          start_date: string
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount_raised?: number | null
          category: string
          created_at?: string | null
          description: string
          end_date: string
          funding_goal: number
          minimum_investment: number
          owner_id?: string | null
          project_id?: string
          shariah_compliant?: boolean | null
          start_date: string
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount_raised?: number | null
          category?: string
          created_at?: string | null
          description?: string
          end_date?: string
          funding_goal?: number
          minimum_investment?: number
          owner_id?: string | null
          project_id?: string
          shariah_compliant?: boolean | null
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          message: string
          message_id: string
          sender_id: string | null
          sent_at: string | null
          ticket_id: string | null
        }
        Insert: {
          message: string
          message_id?: string
          sender_id?: string | null
          sent_at?: string | null
          ticket_id?: string | null
        }
        Update: {
          message?: string
          message_id?: string
          sender_id?: string | null
          sent_at?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string | null
          message: string
          status: string | null
          ticket_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          message: string
          status?: string | null
          ticket_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          message?: string
          status?: string | null
          ticket_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          date: string | null
          details: string | null
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          date?: string | null
          details?: string | null
          transaction_id?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          date?: string | null
          details?: string | null
          transaction_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      admin_action_type:
        | "suspend_account"
        | "reactivate_account"
        | "delete_account"
        | "approve_project"
        | "reject_project"
      applicable_to: "investor" | "project_owner"
      commission_type:
        | "entry_fee"
        | "management_fee"
        | "withdrawal_fee"
        | "project_fee"
      investment_status: "pending" | "confirmed" | "cancelled"
      kyc_status: "pending" | "approved" | "rejected"
      project_status:
        | "pending"
        | "approved"
        | "rejected"
        | "funding"
        | "completed"
      transaction_type: "investment" | "withdrawal" | "commission" | "refund"
      user_type: "investor" | "project_owner" | "admin" | "investment_manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
