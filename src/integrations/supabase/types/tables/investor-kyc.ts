export interface InvestorKYCTable {
  Row: {
    id: string
    national_id_number: string | null
    date_of_birth: string | null
    occupation: string | null
    employer: string | null
    annual_income: number | null
    source_of_funds: string | null
    risk_tolerance: string | null
    investment_experience: string | null
    bank_account_details: any | null
    verification_status: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id: string
    national_id_number?: string | null
    date_of_birth?: string | null
    occupation?: string | null
    employer?: string | null
    annual_income?: number | null
    source_of_funds?: string | null
    risk_tolerance?: string | null
    investment_experience?: string | null
    bank_account_details?: any | null
    verification_status?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    national_id_number?: string | null
    date_of_birth?: string | null
    occupation?: string | null
    employer?: string | null
    annual_income?: number | null
    source_of_funds?: string | null
    risk_tolerance?: string | null
    investment_experience?: string | null
    bank_account_details?: any | null
    verification_status?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}