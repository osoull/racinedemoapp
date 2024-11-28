export interface PlatformSettingsTable {
  Row: {
    id: string
    setting_key: string
    setting_value: any
    category: string
    description: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    setting_key: string
    setting_value: any
    category: string
    description?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    setting_key?: string
    setting_value?: any
    category?: string
    description?: string | null
    created_at?: string
    updated_at?: string
  }
}