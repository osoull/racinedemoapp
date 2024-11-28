export interface PaymentDefault {
  id: string;
  borrower_id: string;
  funding_request_id: string;
  start_date: string;
  status: 'active' | 'resolved' | 'archived';
  total_amount_due: number;
  resolution_date?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  borrower?: {
    first_name: string;
    last_name: string;
  };
  funding_request?: {
    title: string;
  };
}

export interface ResolutionPlan {
  id: string;
  default_id: string;
  proposed_by: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'completed';
  original_amount: number;
  new_amount: number;
  installments_count: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface PlanInstallment {
  id: string;
  plan_id: string;
  due_date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface DefaultAction {
  id: string;
  default_id: string;
  action_type: string;
  performed_by: string;
  details: Record<string, any>;
  created_at: string;
}