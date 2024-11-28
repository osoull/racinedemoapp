export interface TransactionsTable {
  Row: {
    id: string
    user_id: string | null
    amount: number
    type: string
    status: string | null
    created_at: string
    commission_id: string | null
    fee_amount: number | null
    fee_type: string | null
  }
  Insert: {
    id?: string
    user_id?: string | null
    amount: number
    type: string
    status?: string | null
    created_at?: string
    commission_id?: string | null
    fee_amount?: number | null
    fee_type?: string | null
  }
  Update: {
    id?: string
    user_id?: string | null
    amount?: number
    type?: string
    status?: string | null
    created_at?: string
    commission_id?: string | null
    fee_amount?: number | null
    fee_type?: string | null
  }
}