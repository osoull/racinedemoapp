export interface BankTransactionsTable {
  Row: {
    id: string
    transaction_id: string | null
    bank_account_id: string | null
    reference_number: string | null
    bank_status: string | null
    verification_date: string | null
    verification_notes: string | null
    created_at: string | null
    updated_at: string | null
    amount: number
    status: string | null
    user_id: string | null
  }
  Insert: {
    id?: string
    transaction_id?: string | null
    bank_account_id?: string | null
    reference_number?: string | null
    bank_status?: string | null
    verification_date?: string | null
    verification_notes?: string | null
    created_at?: string | null
    updated_at?: string | null
    amount: number
    status?: string | null
    user_id?: string | null
  }
  Update: {
    id?: string
    transaction_id?: string | null
    bank_account_id?: string | null
    reference_number?: string | null
    bank_status?: string | null
    verification_date?: string | null
    verification_notes?: string | null
    created_at?: string | null
    updated_at?: string | null
    amount?: number
    status?: string | null
    user_id?: string | null
  }
}