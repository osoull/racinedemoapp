export interface PlatformLicensesTable {
  Row: {
    id: string
    license_type: string
    license_number: string
    issue_date: string
    expiry_date: string
    status: string
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    license_type: string
    license_number: string
    issue_date: string
    expiry_date: string
    status?: string
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    license_type?: string
    license_number?: string
    issue_date?: string
    expiry_date?: string
    status?: string
    created_at?: string
    updated_at?: string
  }
}