export interface StripePaymentsTable {
  Row: {
    id: string;
    user_id: string | null;
    transaction_id: string | null;
    stripe_session_id: string;
    amount: number;
    status: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    transaction_id?: string | null;
    stripe_session_id: string;
    amount: number;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    transaction_id?: string | null;
    stripe_session_id?: string;
    amount?: number;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}