export interface BorrowerKYCTable {
  Row: {
    id: string
    company_registration_date: string | null
    company_registration_number: string | null
    tax_identification_number: string | null
    legal_representative_name: string | null
    legal_representative_id: string | null
    annual_revenue: number | null
    number_of_employees: number | null
    industry_sector: string | null
    company_website: string | null
    bank_account_details: any | null
    verification_status: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id: string
    company_registration_date?: string | null
    company_registration_number?: string | null
    tax_identification_number?: string | null
    legal_representative_name?: string | null
    legal_representative_id?: string | null
    annual_revenue?: number | null
    number_of_employees?: number | null
    industry_sector?: string | null
    company_website?: string | null
    bank_account_details?: any | null
    verification_status?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    company_registration_date?: string | null
    company_registration_number?: string | null
    tax_identification_number?: string | null
    legal_representative_name?: string | null
    legal_representative_id?: string | null
    annual_revenue?: number | null
    number_of_employees?: number | null
    industry_sector?: string | null
    company_website?: string | null
    bank_account_details?: any | null
    verification_status?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}