export interface PlatformStats {
  active_investors: number
  investor_growth: number
  total_investments: number
  investment_growth: number
  total_revenue: number
  revenue_growth: number
  active_opportunities: number
  average_investment_size: number
}

export interface RevenueByPeriod {
  period: string
  admin_fees: number
  collection_fees: number
  basic_investor_fees: number
  qualified_investor_fees: number
  total_fees: number
}

export interface Transaction {
  id: string
  amount: number
  type: string
  status: string
  created_at: string
  user: {
    first_name: string
    last_name: string
  }
  investment?: {
    amount: number
    project: {
      title: string
    }
  }
}

export interface Investor {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  kyc_status: string
  investor_type: string
  avatar_url: string
  annual_income: number
  risk_tolerance: string
  investment_experience: string
  investor_kyc: {
    verification_status: string
  }
}