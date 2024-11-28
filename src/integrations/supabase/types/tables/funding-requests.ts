export interface FundingRequestsTable {
  Row: {
    id: string
    owner_id: string
    title: string
    description: string
    category: string
    funding_goal: number
    campaign_duration: number
    fund_usage_plan: any
    status: string
    fees_paid: boolean
    fees_transaction_id: string | null
    created_at: string | null
    updated_at: string | null
    submitted_at: string | null
    approved_at: string | null
    metadata: any | null
    current_funding: number | null
    risk_rating: string | null
    risk_description: string | null
  }
  Insert: {
    id?: string
    owner_id: string
    title: string
    description: string
    category: string
    funding_goal: number
    campaign_duration: number
    fund_usage_plan: any
    status?: string
    fees_paid?: boolean
    fees_transaction_id?: string | null
    created_at?: string | null
    updated_at?: string | null
    submitted_at?: string | null
    approved_at?: string | null
    metadata?: any | null
    current_funding?: number | null
    risk_rating?: string | null
    risk_description?: string | null
  }
  Update: {
    id?: string
    owner_id?: string
    title?: string
    description?: string
    category?: string
    funding_goal?: number
    campaign_duration?: number
    fund_usage_plan?: any
    status?: string
    fees_paid?: boolean
    fees_transaction_id?: string | null
    created_at?: string | null
    updated_at?: string | null
    submitted_at?: string | null
    approved_at?: string | null
    metadata?: any | null
    current_funding?: number | null
    risk_rating?: string | null
    risk_description?: string | null
  }
}