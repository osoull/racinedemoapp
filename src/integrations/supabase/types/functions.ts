export interface DatabaseFunctions {
  calculate_funding_request_stats: {
    Args: {
      start_date?: string
      end_date?: string
    }
    Returns: {
      total_requests: number
      approved_requests: number
      rejected_requests: number
      pending_requests: number
      total_amount_requested: number
      total_amount_approved: number
      total_fees_collected: number
      requests_by_category: any
      requests_by_status: any
    }[]
  }
  calculate_platform_stats: {
    Args: Record<PropertyKey, never>
    Returns: {
      total_investments: number
      investment_growth: number
      active_investors: number
      investor_growth: number
      total_revenue: number
      revenue_growth: number
    }[]
  }
  calculate_revenue_by_period: {
    Args: {
      start_date: string
      end_date: string
    }
    Returns: {
      period: string
      admin_fees: number
      collection_fees: number
      basic_investor_fees: number
      qualified_investor_fees: number
      total_fees: number
    }[]
  }
  calculate_transaction_fees: {
    Args: {
      amount: number
      user_type: string
    }
    Returns: any
  }
  get_investors: {
    Args: Record<PropertyKey, never>
    Returns: {
      id: string
      email: string
      first_name: string
      middle_name: string
      last_name: string
      created_at: string
      kyc_status: string
      investor_type: string
      avatar_url: string
      annual_income: number
      risk_tolerance: string
      investment_experience: string
    }[]
  }
  calculate_borrower_stats: {
    Args: Record<PropertyKey, never>
    Returns: {
      total_borrowers: number
      active_borrowers: number
      borrower_growth: number
      active_growth: number
      total_requests: number
      total_borrowed: number
    }[]
  }
}