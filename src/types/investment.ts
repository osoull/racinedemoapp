export interface Investment {
  id: string
  amount: number
  type: string
  status: string
  created_at: string
  funding_request: {
    title: string
    funding_goal: number
    current_funding: number
    status: string
  }
  user: {
    first_name: string
    last_name: string
  }
}

export interface Transaction {
  id: string
  amount: number
  type: string
  status: string
  created_at: string
  user_id: string
  commission_id: string | null
  fee_amount: number | null
  fee_type: string | null
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
  fee_details?: {
    type: string
    amount: number
  }[]
}