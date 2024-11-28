export interface KYCStatusHistoryTable {
  Row: {
    id: string
    user_id: string | null
    old_status: string | null
    new_status: string | null
    changed_by: string | null
    notes: string | null
    created_at: string | null
  }
  Insert: {
    id?: string
    user_id?: string | null
    old_status?: string | null
    new_status?: string | null
    changed_by?: string | null
    notes?: string | null
    created_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string | null
    old_status?: string | null
    new_status?: string | null
    changed_by?: string | null
    notes?: string | null
    created_at?: string | null
  }
}