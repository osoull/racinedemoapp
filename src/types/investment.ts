export interface Investment {
  id: string
  amount: number
  commission_id: string
  created_at: string
  fee_amount: number
  fee_type: string
  status: string
  type: string
  user_id: string
  user: {
    id: string
    first_name: string
    last_name: string
  }
  investment: {
    id: string
    funding_request: {
      title: string
      description: string
    }
  }
  stripe_payments?: {
    stripe_session_id: string
    status: string
  }[]
  bank_transactions?: {
    bank_status: string
    reference_number: string
  }[]
}

export interface InvestmentFilters {
  search: string
  status: string | null
  investor: string | null
  opportunity: string | null
  dateRange: DateRange | undefined
}