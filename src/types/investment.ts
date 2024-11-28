export interface Investment {
  id: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  funding_request: {
    title: string;
    funding_goal: number;
    current_funding: number;
    status: string;
  };
  user?: {
    first_name: string;
    last_name: string;
  };
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  user_id: string;
  commission_id: string;
  fee_amount: number;
  fee_type: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}