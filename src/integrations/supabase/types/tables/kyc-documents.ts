export interface KYCDocumentsTable {
  Row: {
    id: string
    user_id: string | null
    document_type: string
    document_url: string
    status: string | null
    created_at: string
    updated_at: string
    verification_notes: string | null
    verified_by: string | null
    verified_at: string | null
  }
  Insert: {
    id?: string
    user_id?: string | null
    document_type: string
    document_url: string
    status?: string | null
    created_at?: string
    updated_at?: string
    verification_notes?: string | null
    verified_by?: string | null
    verified_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string | null
    document_type?: string
    document_url?: string
    status?: string | null
    created_at?: string
    updated_at?: string
    verification_notes?: string | null
    verified_by?: string | null
    verified_at?: string | null
  }
}