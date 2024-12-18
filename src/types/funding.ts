export interface FundingRequest {
  id: string
  title: string
  description: string
  category: string
  funding_goal: number
  current_funding: number
  campaign_duration: number
  fund_usage_plan: string
  status: string
  fees_paid: boolean
  owner_id: string
  created_at: string
  submitted_at?: string
  approved_at?: string
  risk_rating?: string
  risk_description?: string
  owner?: {
    first_name: string
    last_name: string
  }
  business_plan?: string
  financial_statements?: string
  additional_documents?: string
  documents?: Array<{
    document_type: string
    document_url: string
  }>
}

export interface FundingStats {
  total_requests: number
  approved_requests: number
  rejected_requests: number
  pending_requests: number
  total_amount_requested: number
  total_amount_approved: number
  total_fees_collected: number
  requests_by_category: Record<string, number>
  requests_by_status: Record<string, number>
}