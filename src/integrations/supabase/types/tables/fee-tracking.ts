export interface FeeTrackingTable {
  Row: {
    id: string
    transaction_id: string
    commission_id: string
    amount: number
    fee_amount: number
    fee_type: string
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    transaction_id: string
    commission_id: string
    amount: number
    fee_amount: number
    fee_type: string
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    transaction_id?: string
    commission_id?: string
    amount?: number
    fee_amount?: number
    fee_type?: string
    created_at?: string | null
    updated_at?: string | null
  }
}