export interface CommissionsTable {
  Row: {
    commission_id: string
    commission_type: string
    rate: number
    created_at: string
    updated_at: string
  }
  Insert: {
    commission_id?: string
    commission_type: string
    rate: number
    created_at?: string
    updated_at?: string
  }
  Update: {
    commission_id?: string
    commission_type?: string
    rate?: number
    created_at?: string
    updated_at?: string
  }
}