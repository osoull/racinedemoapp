export interface PaymentDefaultsTable {
  Row: {
    id: string;
    borrower_id: string;
    funding_request_id: string;
    start_date: string;
    status: 'active' | 'resolved' | 'archived';
    total_amount_due: number;
    resolution_date?: string;
    resolution_notes?: string;
    created_at?: string;
    updated_at?: string;
  };
  Insert: Omit<PaymentDefaultsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<PaymentDefaultsTable['Insert']>;
}

export interface PaymentResolutionPlansTable {
  Row: {
    id: string;
    default_id: string;
    proposed_by: string;
    status: 'proposed' | 'accepted' | 'rejected' | 'completed';
    original_amount: number;
    new_amount: number;
    installments_count: number;
    start_date: string;
    end_date: string;
    created_at?: string;
    updated_at?: string;
  };
  Insert: Omit<PaymentResolutionPlansTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<PaymentResolutionPlansTable['Insert']>;
}

export interface ResolutionPlanInstallmentsTable {
  Row: {
    id: string;
    plan_id: string;
    due_date: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
    created_at?: string;
    updated_at?: string;
  };
  Insert: Omit<ResolutionPlanInstallmentsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<ResolutionPlanInstallmentsTable['Insert']>;
}

export interface DefaultActionHistoryTable {
  Row: {
    id: string;
    default_id: string;
    action_type: string;
    performed_by: string;
    details: Record<string, any>;
    created_at?: string;
  };
  Insert: Omit<DefaultActionHistoryTable['Row'], 'id' | 'created_at'>;
  Update: Partial<DefaultActionHistoryTable['Insert']>;
}