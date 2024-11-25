export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  user_type: 'investor' | 'borrower' | 'admin' | 'investment_manager';
  investor_type: 'basic' | 'qualified' | undefined;
  kyc_status?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  address?: string;
  national_id?: string;
  company_name?: string;
  commercial_register?: string;
  business_type?: string;
  business_address?: string;
  business_description?: string;
  profile_completed?: boolean;
}

export type UserType = User['user_type'];
export type InvestorType = 'basic' | 'qualified';

export interface Profile extends User {
  avatar_url?: string | null;
}