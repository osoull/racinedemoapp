export interface User {
  id: string;
  email: string | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  user_type: UserType;
  kyc_status?: string | null;
  created_at?: string;
  updated_at?: string;
  phone?: string | null;
  national_id?: string | null;
  company_name?: string | null;
  commercial_register?: string | null;
  business_type?: string | null;
  business_address?: string | null;
  business_description?: string | null;
  profile_completed?: boolean | null;
  street_number?: string | null;
  street_name?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
}

export type UserType = 'admin' | 'basic_investor' | 'qualified_investor' | 'borrower' | 'investment_manager';

export interface Profile extends User {
  avatar_url?: string | null;
}