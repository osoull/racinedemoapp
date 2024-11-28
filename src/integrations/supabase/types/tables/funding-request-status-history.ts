export interface FundingRequestStatusHistoryTable {
  Row: {
    id: string;
    request_id: string;
    old_status: string | null;
    new_status: string;
    changed_by: string | null;
    notes: string | null;
    created_at: string | null;
  };
  Insert: {
    id?: string;
    request_id: string;
    old_status?: string | null;
    new_status: string;
    changed_by?: string | null;
    notes?: string | null;
    created_at?: string | null;
  };
  Update: {
    id?: string;
    request_id?: string;
    old_status?: string | null;
    new_status?: string;
    changed_by?: string | null;
    notes?: string | null;
    created_at?: string | null;
  };
}