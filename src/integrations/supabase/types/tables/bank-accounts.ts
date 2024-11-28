export interface BankAccountsTable {
  Row: {
    id: string
    user_id: string
    account_name: string
    bank_name: string
    iban: string
    swift: string | null
    account_number: string | null
    is_primary: boolean | null
    status: string | null
    verification_date: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    user_id: string
    account_name: string
    bank_name: string
    iban: string
    swift?: string | null
    account_number?: string | null
    is_primary?: boolean | null
    status?: string | null
    verification_date?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string
    account_name?: string
    bank_name?: string
    iban?: string
    swift?: string | null
    account_number?: string | null
    is_primary?: boolean | null
    status?: string | null
    verification_date?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
}