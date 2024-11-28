export interface PlatformStatisticsTable {
  Row: {
    id: string
    metric_name: string
    metric_value: number
    period: string
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    metric_name: string
    metric_value: number
    period: string
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    metric_name?: string
    metric_value?: number
    period?: string
    created_at?: string
    updated_at?: string
  }
}