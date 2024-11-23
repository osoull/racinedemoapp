export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          national_id: string | null
          kyc_status: 'pending' | 'approved' | 'rejected'
          user_type: 'investor' | 'project_owner' | 'admin' | 'investment_manager'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          national_id?: string | null
          kyc_status?: 'pending' | 'approved' | 'rejected'
          user_type?: 'investor' | 'project_owner' | 'admin' | 'investment_manager'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          national_id?: string | null
          kyc_status?: 'pending' | 'approved' | 'rejected'
          user_type?: 'investor' | 'project_owner' | 'admin' | 'investment_manager'
          created_at?: string
        }
      }
      projects: {
        Row: {
          project_id: string
          title: string
          description: string | null
          owner: string | null
          status: 'pending' | 'approved' | 'rejected' | 'funding' | 'completed'
          created_at: string
        }
        Insert: {
          project_id?: string
          title: string
          description?: string | null
          owner?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'funding' | 'completed'
          created_at?: string
        }
        Update: {
          project_id?: string
          title?: string
          description?: string | null
          owner?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'funding' | 'completed'
          created_at?: string
        }
      }
      project_reviews: {
        Row: {
          review_id: string
          project_id: string | null
          content: string | null
          created_at: string
        }
        Insert: {
          review_id?: string
          project_id?: string | null
          content?: string | null
          created_at?: string
        }
        Update: {
          review_id?: string
          project_id?: string | null
          content?: string | null
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          ticket_id: string
          user_id: string | null
          category: string
          status: string
          created_at: string
        }
        Insert: {
          ticket_id?: string
          user_id?: string | null
          category: string
          status?: string
          created_at?: string
        }
        Update: {
          ticket_id?: string
          user_id?: string | null
          category?: string
          status?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          notification_id: string
          user_id: string | null
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          notification_id?: string
          user_id?: string | null
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          notification_id?: string
          user_id?: string | null
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      commissions: {
        Row: {
          commission_id: string
          commission_type: 'entry_fee' | 'management_fee' | 'withdrawal_fee' | 'project_fee'
          applicable_to: 'investor' | 'project_owner'
          rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          commission_id?: string
          commission_type: 'entry_fee' | 'management_fee' | 'withdrawal_fee' | 'project_fee'
          applicable_to: 'investor' | 'project_owner'
          rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          commission_id?: string
          commission_type?: 'entry_fee' | 'management_fee' | 'withdrawal_fee' | 'project_fee'
          applicable_to?: 'investor' | 'project_owner'
          rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      investments: {
        Row: {
          investment_id: string
          investor_id: string | null
          project_id: string | null
          amount: number
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
        }
        Insert: {
          investment_id?: string
          investor_id?: string | null
          project_id?: string | null
          amount: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
        }
        Update: {
          investment_id?: string
          investor_id?: string | null
          project_id?: string | null
          amount?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
        }
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]