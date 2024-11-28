export interface InvestmentOpportunity {
  id: string
  funding_request_id: string
  status: string
  start_date: string | null
  end_date: string | null
  total_invested: number
  funding_request: {
    id: string
    title: string
    description: string
    category: string
    funding_goal: number
    current_funding: number
    risk_rating: string | null
    risk_description: string | null
    owner: {
      id: string
      first_name: string
      last_name: string
      company_name: string | null
    }
  }
}