export interface User {
  id: string;
  email: string | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  user_type: 'admin' | 'investment_manager' | 'basic_investor' | 'qualified_investor' | 'borrower';
  kyc_status?: string | null;
  created_at?: string;
  updated_at?: string;
  phone?: string | null;
  address?: string | null;
  national_id?: string | null;
  company_name?: string | null;
  commercial_register?: string | null;
  business_type?: string | null;
  business_address?: string | null;
  business_description?: string | null;
  profile_completed?: boolean | null;
}

export type UserType = User['user_type'];

export interface Profile extends User {
  avatar_url?: string | null;
  investor_type?: 'basic' | 'qualified' | null;
}