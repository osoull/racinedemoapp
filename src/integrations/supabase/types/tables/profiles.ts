export interface ProfilesTable {
  Row: {
    id: string
    email: string | null
    user_type: string
    created_at: string
    updated_at: string
    national_id: string | null
    kyc_status: string | null
    phone: string | null
    first_name: string
    middle_name: string | null
    last_name: string
    company_name: string | null
    commercial_register: string | null
    business_type: string | null
    business_address: string | null
    business_description: string | null
    profile_completed: boolean | null
    avatar_url: string | null
    street_number: string | null
    street_name: string | null
    postal_code: string | null
    city: string | null
    country: string | null
  }
  Insert: {
    id: string
    email?: string | null
    user_type?: string
    created_at?: string
    updated_at?: string
    national_id?: string | null
    kyc_status?: string | null
    phone?: string | null
    first_name: string
    middle_name?: string | null
    last_name: string
    company_name?: string | null
    commercial_register?: string | null
    business_type?: string | null
    business_address?: string | null
    business_description?: string | null
    profile_completed?: boolean | null
    avatar_url?: string | null
    street_number?: string | null
    street_name?: string | null
    postal_code?: string | null
    city?: string | null
    country?: string | null
  }
  Update: {
    id?: string
    email?: string | null
    user_type?: string
    created_at?: string
    updated_at?: string
    national_id?: string | null
    kyc_status?: string | null
    phone?: string | null
    first_name?: string
    middle_name?: string | null
    last_name?: string
    company_name?: string | null
    commercial_register?: string | null
    business_type?: string | null
    business_address?: string | null
    business_description?: string | null
    profile_completed?: boolean | null
    avatar_url?: string | null
    street_number?: string | null
    street_name?: string | null
    postal_code?: string | null
    city?: string | null
    country?: string | null
  }
}