export interface RegulatoryReportsTable {
  Row: {
    id: string;
    title: string;
    file_url: string;
    upload_date: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    title: string;
    file_url: string;
    upload_date?: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    title?: string;
    file_url?: string;
    upload_date?: string;
    created_at?: string;
  };
}