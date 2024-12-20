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
          account_holder_name: string | null
          account_name: string
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
          account_holder_name?: string | null
          account_name: string
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
          account_holder_name?: string | null
          account_name?: string
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
          amount: number
          bank_account_id: string | null
          bank_status: string | null
          created_at: string | null
          id: string
          reference_number: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
          verification_notes: string | null
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          bank_status?: string | null
          created_at?: string | null
          id?: string
          reference_number?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          verification_notes?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          bank_status?: string | null
          created_at?: string | null
          id?: string
          reference_number?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          {
            foreignKeyName: "bank_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          last_verification_attempt: string | null
          legal_representative_id: string | null
          legal_representative_name: string | null
          number_of_employees: number | null
          rejection_reason: string | null
          tax_identification_number: string | null
          updated_at: string | null
          verification_expiry_date: string | null
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
          last_verification_attempt?: string | null
          legal_representative_id?: string | null
          legal_representative_name?: string | null
          number_of_employees?: number | null
          rejection_reason?: string | null
          tax_identification_number?: string | null
          updated_at?: string | null
          verification_expiry_date?: string | null
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
          last_verification_attempt?: string | null
          legal_representative_id?: string | null
          legal_representative_name?: string | null
          number_of_employees?: number | null
          rejection_reason?: string | null
          tax_identification_number?: string | null
          updated_at?: string | null
          verification_expiry_date?: string | null
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
      default_action_history: {
        Row: {
          action_type: string
          created_at: string | null
          default_id: string
          details: Json
          id: string
          performed_by: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          default_id: string
          details: Json
          id?: string
          performed_by: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          default_id?: string
          details?: Json
          id?: string
          performed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "default_action_history_default_id_fkey"
            columns: ["default_id"]
            isOneToOne: false
            referencedRelation: "payment_defaults"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "default_action_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_tracking: {
        Row: {
          amount: number
          commission_id: string
          created_at: string | null
          fee_amount: number
          fee_type: string
          id: string
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          commission_id: string
          created_at?: string | null
          fee_amount: number
          fee_type: string
          id?: string
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          commission_id?: string
          created_at?: string | null
          fee_amount?: number
          fee_type?: string
          id?: string
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_tracking_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["commission_id"]
          },
          {
            foreignKeyName: "fee_tracking_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_request_comments: {
        Row: {
          author_id: string
          comment: string
          created_at: string | null
          id: string
          request_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          comment: string
          created_at?: string | null
          id?: string
          request_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          comment?: string
          created_at?: string | null
          id?: string
          request_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_request_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funding_request_comments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "funding_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_request_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          id: string
          request_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          id?: string
          request_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          id?: string
          request_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_request_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "funding_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_request_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          old_status: string | null
          request_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          old_status?: string | null
          request_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_request_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funding_request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "funding_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_requests: {
        Row: {
          application_fee: number | null
          approved_at: string | null
          campaign_duration: number
          category: string
          completion_steps: Json | null
          created_at: string | null
          current_funding: number | null
          description: string
          expected_completion_date: string | null
          fees_paid: boolean
          fees_transaction_id: string | null
          fund_usage_plan: Json
          funding_goal: number
          id: string
          last_status_change: string | null
          metadata: Json | null
          owner_id: string
          payment_method: string | null
          risk_description: string | null
          risk_rating: string | null
          sharia_notes: string | null
          sharia_review_date: string | null
          sharia_review_status: string | null
          sharia_reviewer_id: string | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_fee?: number | null
          approved_at?: string | null
          campaign_duration: number
          category: string
          completion_steps?: Json | null
          created_at?: string | null
          current_funding?: number | null
          description: string
          expected_completion_date?: string | null
          fees_paid?: boolean
          fees_transaction_id?: string | null
          fund_usage_plan: Json
          funding_goal: number
          id?: string
          last_status_change?: string | null
          metadata?: Json | null
          owner_id: string
          payment_method?: string | null
          risk_description?: string | null
          risk_rating?: string | null
          sharia_notes?: string | null
          sharia_review_date?: string | null
          sharia_review_status?: string | null
          sharia_reviewer_id?: string | null
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_fee?: number | null
          approved_at?: string | null
          campaign_duration?: number
          category?: string
          completion_steps?: Json | null
          created_at?: string | null
          current_funding?: number | null
          description?: string
          expected_completion_date?: string | null
          fees_paid?: boolean
          fees_transaction_id?: string | null
          fund_usage_plan?: Json
          funding_goal?: number
          id?: string
          last_status_change?: string | null
          metadata?: Json | null
          owner_id?: string
          payment_method?: string | null
          risk_description?: string | null
          risk_rating?: string | null
          sharia_notes?: string | null
          sharia_review_date?: string | null
          sharia_review_status?: string | null
          sharia_reviewer_id?: string | null
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_requests_fees_transaction_id_fkey"
            columns: ["fees_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funding_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funding_requests_sharia_reviewer_id_fkey"
            columns: ["sharia_reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_opportunities: {
        Row: {
          created_at: string | null
          end_date: string | null
          expected_return_rate: number | null
          funding_request_id: string
          id: string
          investment_term_months: number | null
          maximum_investment: number | null
          minimum_investment: number | null
          risk_level: string | null
          start_date: string | null
          status: string
          total_invested: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          expected_return_rate?: number | null
          funding_request_id: string
          id?: string
          investment_term_months?: number | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          risk_level?: string | null
          start_date?: string | null
          status?: string
          total_invested?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          expected_return_rate?: number | null
          funding_request_id?: string
          id?: string
          investment_term_months?: number | null
          maximum_investment?: number | null
          minimum_investment?: number | null
          risk_level?: string | null
          start_date?: string | null
          status?: string
          total_invested?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_funding_request"
            columns: ["funding_request_id"]
            isOneToOne: false
            referencedRelation: "funding_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_opportunities_funding_request_id_fkey"
            columns: ["funding_request_id"]
            isOneToOne: false
            referencedRelation: "funding_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_targets: {
        Row: {
          created_at: string | null
          current_amount: number | null
          end_date: string | null
          id: string
          opportunity_id: string | null
          start_date: string | null
          status: string | null
          target_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          end_date?: string | null
          id?: string
          opportunity_id?: string | null
          start_date?: string | null
          status?: string | null
          target_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          end_date?: string | null
          id?: string
          opportunity_id?: string | null
          start_date?: string | null
          status?: string | null
          target_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_targets_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "investment_opportunities"
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
          last_verification_attempt: string | null
          national_id_number: string | null
          occupation: string | null
          rejection_reason: string | null
          risk_tolerance: string | null
          source_of_funds: string | null
          updated_at: string | null
          verification_expiry_date: string | null
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
          last_verification_attempt?: string | null
          national_id_number?: string | null
          occupation?: string | null
          rejection_reason?: string | null
          risk_tolerance?: string | null
          source_of_funds?: string | null
          updated_at?: string | null
          verification_expiry_date?: string | null
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
          last_verification_attempt?: string | null
          national_id_number?: string | null
          occupation?: string | null
          rejection_reason?: string | null
          risk_tolerance?: string | null
          source_of_funds?: string | null
          updated_at?: string | null
          verification_expiry_date?: string | null
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
      payment_defaults: {
        Row: {
          borrower_id: string
          created_at: string | null
          funding_request_id: string
          id: string
          resolution_date: string | null
          resolution_notes: string | null
          start_date: string
          status: string
          total_amount_due: number
          updated_at: string | null
        }
        Insert: {
          borrower_id: string
          created_at?: string | null
          funding_request_id: string
          id?: string
          resolution_date?: string | null
          resolution_notes?: string | null
          start_date?: string
          status?: string
          total_amount_due: number
          updated_at?: string | null
        }
        Update: {
          borrower_id?: string
          created_at?: string | null
          funding_request_id?: string
          id?: string
          resolution_date?: string | null
          resolution_notes?: string | null
          start_date?: string
          status?: string
          total_amount_due?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_defaults_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_defaults_funding_request_id_fkey"
            columns: ["funding_request_id"]
            isOneToOne: false
            referencedRelation: "funding_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_resolution_plans: {
        Row: {
          created_at: string | null
          default_id: string
          end_date: string
          id: string
          installments_count: number
          new_amount: number
          original_amount: number
          proposed_by: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_id: string
          end_date: string
          id?: string
          installments_count: number
          new_amount: number
          original_amount: number
          proposed_by: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_id?: string
          end_date?: string
          id?: string
          installments_count?: number
          new_amount?: number
          original_amount?: number
          proposed_by?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_resolution_plans_default_id_fkey"
            columns: ["default_id"]
            isOneToOne: false
            referencedRelation: "payment_defaults"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_resolution_plans_proposed_by_fkey"
            columns: ["proposed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_bank_accounts: {
        Row: {
          account_name: string
          account_number: string | null
          bank_name: string
          created_at: string | null
          iban: string
          id: string
          is_active: boolean | null
          swift: string | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number?: string | null
          bank_name: string
          created_at?: string | null
          iban: string
          id?: string
          is_active?: boolean | null
          swift?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string | null
          bank_name?: string
          created_at?: string | null
          iban?: string
          id?: string
          is_active?: boolean | null
          swift?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          account_status: string | null
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
          last_login_at: string | null
          last_name: string
          middle_name: string | null
          national_id: string | null
          phone: string | null
          postal_code: string | null
          preferred_language: string | null
          profile_completed: boolean | null
          street_name: string | null
          street_number: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          account_status?: string | null
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
          last_login_at?: string | null
          last_name: string
          middle_name?: string | null
          national_id?: string | null
          phone?: string | null
          postal_code?: string | null
          preferred_language?: string | null
          profile_completed?: boolean | null
          street_name?: string | null
          street_number?: string | null
          updated_at?: string
          user_type?: string
        }
        Update: {
          account_status?: string | null
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
          last_login_at?: string | null
          last_name?: string
          middle_name?: string | null
          national_id?: string | null
          phone?: string | null
          postal_code?: string | null
          preferred_language?: string | null
          profile_completed?: boolean | null
          street_name?: string | null
          street_number?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
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
      resolution_plan_installments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          plan_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id?: string
          plan_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          plan_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resolution_plan_installments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "payment_resolution_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sharia_review_history: {
        Row: {
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          old_status: string | null
          request_id: string
          reviewer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          old_status?: string | null
          request_id: string
          reviewer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
          request_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sharia_review_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "funding_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sharia_review_history_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      transactions: {
        Row: {
          amount: number
          commission_id: string | null
          created_at: string
          fee_amount: number | null
          fee_type: string | null
          id: string
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          commission_id?: string | null
          created_at?: string
          fee_amount?: number | null
          fee_type?: string | null
          id?: string
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          commission_id?: string | null
          created_at?: string
          fee_amount?: number | null
          fee_type?: string | null
          id?: string
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["commission_id"]
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
      borrower_overview: {
        Row: {
          approved_requests: number | null
          borrower_id: string | null
          company_name: string | null
          first_name: string | null
          last_name: string | null
          last_request_date: string | null
          total_funded_amount: number | null
          total_requests: number | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_requests_owner_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_application_fee: {
        Args: {
          funding_amount: number
        }
        Returns: number
      }
      calculate_borrower_detailed_stats: {
        Args: {
          p_borrower_id: string
        }
        Returns: {
          total_requested: number
          total_funded: number
          active_requests: number
          total_requests: number
          pending_payments: number
          success_rate: number
          average_funding_time: unknown
          total_fees_paid: number
        }[]
      }
      calculate_borrower_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_borrowers: number
          active_borrowers: number
          borrower_growth: number
          active_growth: number
          total_requests: number
          total_borrowed: number
        }[]
      }
      calculate_funding_request_stats: {
        Args: {
          start_date?: string
          end_date?: string
        }
        Returns: {
          total_requests: number
          approved_requests: number
          rejected_requests: number
          pending_requests: number
          total_amount_requested: number
          total_amount_approved: number
          total_fees_collected: number
          requests_by_category: Json
          requests_by_status: Json
        }[]
      }
      calculate_investment_opportunity_stats: {
        Args: {
          opportunity_id: string
        }
        Returns: {
          total_investors: number
          total_invested: number
          achievement_rate: number
          average_investment: number
          remaining_amount: number
        }[]
      }
      calculate_monthly_investment_stats: {
        Args: {
          p_year: number
          p_month: number
        }
        Returns: {
          total_investments: number
          unique_investors: number
          average_investment: number
          success_rate: number
        }[]
      }
      calculate_platform_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_investors: number
          investor_growth: number
          total_investments: number
          investment_growth: number
          total_revenue: number
          revenue_growth: number
          active_opportunities: number
          average_investment_size: number
        }[]
      }
      calculate_revenue_by_period: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          period: string
          admin_fees: number
          collection_fees: number
          basic_investor_fees: number
          qualified_investor_fees: number
          total_fees: number
        }[]
      }
      calculate_risk_score: {
        Args: {
          p_annual_revenue: number
          p_years_in_business: number
          p_previous_defaults: number
        }
        Returns: number
      }
      calculate_transaction_fees: {
        Args: {
          amount: number
          user_type: string
        }
        Returns: Json
      }
      check_borrower_kyc_readiness: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_borrower_payment_history: {
        Args: {
          p_borrower_id: string
        }
        Returns: {
          payment_id: string
          payment_date: string
          amount: number
          status: string
          payment_type: string
          funding_request_id: string
          funding_request_title: string
        }[]
      }
      handle_payment_failure: {
        Args: {
          p_transaction_id: string
          p_error_message: string
        }
        Returns: undefined
      }
      validate_bank_details: {
        Args: {
          details: Json
        }
        Returns: boolean
      }
      validate_bank_details_with_errors: {
        Args: {
          details: Json
        }
        Returns: {
          is_valid: boolean
          errors: string[]
        }[]
      }
      validate_payment: {
        Args: {
          p_transaction_id: string
          p_status: string
          p_notes?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      project_status:
        | "pending"
        | "approved"
        | "active"
        | "rejected"
        | "completed"
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
