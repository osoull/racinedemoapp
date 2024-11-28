export interface FundingRequestCommentsTable {
  Row: {
    id: string;
    request_id: string;
    author_id: string;
    comment: string;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    request_id: string;
    author_id: string;
    comment: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    request_id?: string;
    author_id?: string;
    comment?: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
}