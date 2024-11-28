export interface FundingRequestDocumentsTable {
  Row: {
    id: string;
    request_id: string;
    document_type: string;
    document_url: string;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    request_id: string;
    document_type: string;
    document_url: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    request_id?: string;
    document_type?: string;
    document_url?: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
}