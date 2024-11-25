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
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string | null
          bank_name: string
          created_at: string | null
          iban: string
          id: string
          is_primary: boolean | null
          status: string | null
          swift: string | null
          updated_at: string | null
          user_id: string
          verification_date: string | null
        }
        Insert: {
          account_name: string
          account_number?: string | null
          bank_name: string
          created_at?: string | null
          iban: string
          id?: string
          is_primary?: boolean | null
          status?: string | null
          swift?: string | null
          updated_at?: string | null
          user_id: string
          verification_date?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string | null
          bank_name?: string
          created_at?: string | null
          iban?: string
          id?: string
          is_primary?: boolean | null
          status?: string | null
          swift?: string | null
          updated_at?: string | null
          user_id?: string
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          bank_account_id: string | null
          bank_status: string | null
          created_at: string | null
          id: string
          reference_number: string | null
          transaction_id: string | null
          updated_at: string | null
          verification_date: string | null
          verification_notes: string | null
        }
        Insert: {
          bank_account_id?: string | null
          bank_status?: string | null
          created_at?: string | null
          id?: string
          reference_number?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          verification_date?: string | null
          verification_notes?: string | null
        }
        Update: {
          bank_account_id?: string | null
          bank_status?: string | null
          created_at?: string | null
          id?: string
          reference_number?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          verification_date?: string | null
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      borrower_kyc: {
        Row: {
          annual_revenue: number | null
          bank_account_details: Json | null
          company_registration_date: string | null
          company_registration_number: string | null
          company_website: string | null
          created_at: string | null
          id: string
          industry_sector: string | null
          legal_representative_id: string | null
          legal_representative_name: string | null
          number_of_employees: number | null
          tax_identification_number: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          annual_revenue?: number | null
          bank_account_details?: Json | null
          company_registration_date?: string | null
          company_registration_number?: string | null
          company_website?: string | null
          created_at?: string | null
          id: string
          industry_sector?: string | null
          legal_representative_id?: string | null
          legal_representative_name?: string | null
          number_of_employees?: number | null
          tax_identification_number?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          annual_revenue?: number | null
          bank_account_details?: Json | null
          company_registration_date?: string | null
          company_registration_number?: string | null
          company_website?: string | null
          created_at?: string | null
          id?: string
          industry_sector?: string | null
          legal_representative_id?: string | null
          legal_representative_name?: string | null
          number_of_employees?: number | null
          tax_identification_number?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "borrower_kyc_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          commission_id: string
          commission_type: string
          created_at: string
          rate: number
          updated_at: string
        }
        Insert: {
          commission_id?: string
          commission_type: string
          created_at?: string
          rate: number
          updated_at?: string
        }
        Update: {
          commission_id?: string
          commission_type?: string
          created_at?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount: number
          created_at: string
          investment_id: string
          investor_id: string | null
          project_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          investment_id?: string
          investor_id?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          investment_id?: string
          investor_id?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_kyc: {
        Row: {
          annual_income: number | null
          bank_account_details: Json | null
          created_at: string | null
          date_of_birth: string | null
          employer: string | null
          id: string
          investment_experience: string | null
          national_id_number: string | null
          occupation: string | null
          risk_tolerance: string | null
          source_of_funds: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          annual_income?: number | null
          bank_account_details?: Json | null
          created_at?: string | null
          date_of_birth?: string | null
          employer?: string | null
          id: string
          investment_experience?: string | null
          national_id_number?: string | null
          occupation?: string | null
          risk_tolerance?: string | null
          source_of_funds?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          annual_income?: number | null
          bank_account_details?: Json | null
          created_at?: string | null
          date_of_birth?: string | null
          employer?: string | null
          id?: string
          investment_experience?: string | null
          national_id_number?: string | null
          occupation?: string | null
          risk_tolerance?: string | null
          source_of_funds?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investor_kyc_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          id: string
          status: string | null
          updated_at: string
          user_id: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string | null
          notes: string | null
          old_status: string | null
          user_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          user_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_status_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          date: string
          message: string
          notification_id: string
          read: boolean
          title: string
          user_id: string | null
        }
        Insert: {
          date?: string
          message: string
          notification_id?: string
          read?: boolean
          title: string
          user_id?: string | null
        }
        Update: {
          date?: string
          message?: string
          notification_id?: string
          read?: boolean
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
      platform_licenses: {
        Row: {
          created_at: string
          expiry_date: string
          id: string
          issue_date: string
          license_number: string
          license_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expiry_date: string
          id?: string
          issue_date: string
          license_number: string
          license_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expiry_date?: string
          id?: string
          issue_date?: string
          license_number?: string
          license_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      platform_statistics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          period: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value: number
          period: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          period?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_address: string | null
          business_description: string | null
          business_type: string | null
          city: string | null
          commercial_register: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          kyc_status: string | null
          last_name: string
          middle_name: string | null
          national_id: string | null
          phone: string | null
          postal_code: string | null
          profile_completed: boolean | null
          street_name: string | null
          street_number: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          business_address?: string | null
          business_description?: string | null
          business_type?: string | null
          city?: string | null
          commercial_register?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id: string
          kyc_status?: string | null
          last_name: string
          middle_name?: string | null
          national_id?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_completed?: boolean | null
          street_name?: string | null
          street_number?: string | null
          updated_at?: string
          user_type?: string
        }
        Update: {
          avatar_url?: string | null
          business_address?: string | null
          business_description?: string | null
          business_type?: string | null
          city?: string | null
          commercial_register?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          kyc_status?: string | null
          last_name?: string
          middle_name?: string | null
          national_id?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_completed?: boolean | null
          street_name?: string | null
          street_number?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          id: string
          project_id: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          id?: string
          project_id?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          classification: string
          created_at: string
          current_funding: number | null
          description: string | null
          funding_goal: number
          id: string
          owner_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          classification: string
          created_at?: string
          current_funding?: number | null
          description?: string | null
          funding_goal: number
          id?: string
          owner_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          classification?: string
          created_at?: string
          current_funding?: number | null
          description?: string | null
          funding_goal?: number
          id?: string
          owner_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
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
      regulatory_reports: {
        Row: {
          created_at: string
          file_url: string
          id: string
          title: string
          upload_date: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          title: string
          upload_date?: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          title?: string
          upload_date?: string
        }
        Relationships: []
      }
      risk_ratings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          project_id: string | null
          rating: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string | null
          rating: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string | null
          rating?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_ratings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          status: string | null
          stripe_session_id: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_session_id: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          message: string
          status: string
          ticket_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          message: string
          status?: string
          ticket_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          message?: string
          status?: string
          ticket_id?: string
          updated_at?: string
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
          created_at: string
          id: string
          investment_id: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          investment_id?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          investment_id?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["investment_id"]
          },
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
      calculate_transaction_fees: {
        Args: {
          amount: number
          user_type: string
        }
        Returns: Json
      }
      get_investors: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          first_name: string
          middle_name: string
          last_name: string
          created_at: string
          kyc_status: string
          investor_type: string
          avatar_url: string
          annual_income: number
          risk_tolerance: string
          investment_experience: string
        }[]
      }
      handle_payment_failure: {
        Args: {
          p_transaction_id: string
          p_error_message: string
        }
        Returns: undefined
      }
      validate_payment: {
        Args: {
          p_transaction_id: string
          p_status: string
          p_notes?: string
        }
        Returns: undefined
      }
      validate_project_submission: {
        Args: {
          p_project_id: string
          p_transaction_id: string
        }
        Returns: undefined
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
