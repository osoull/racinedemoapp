export interface InvestmentOpportunitiesTable {
  Row: {
    id: string
    funding_request_id: string
    status: string
    start_date: string | null
    end_date: string | null
    total_invested: number | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    funding_request_id: string
    status?: string
    start_date?: string | null
    end_date?: string | null
    total_invested?: number | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    funding_request_id?: string
    status?: string
    start_date?: string | null
    end_date?: string | null
    total_invested?: number | null
    created_at?: string | null
    updated_at?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "fk_funding_request"
      columns: ["funding_request_id"]
      isOneToOne: false
      referencedRelation: "funding_requests"
      referencedColumns: ["id"]
    }
  ]
}