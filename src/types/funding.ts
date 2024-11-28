export interface FundingRequest {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  funding_goal: number;
  current_funding: number;
  campaign_duration: number;
  fund_usage_plan: any;
  status: string;
  fees_paid: boolean;
  fees_transaction_id?: string;
  risk_rating?: string;
  risk_description?: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  approved_at?: string;
  metadata?: any;
  owner?: {
    first_name: string;
    last_name: string;
  };
}

export type FundingRequestStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface Project extends FundingRequest {
  investments?: Array<{
    id: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
}