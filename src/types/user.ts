export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  user_type: 'investor' | 'project_owner' | 'admin' | 'investment_manager';
  kyc_status?: string;
  created_at: string;
  updated_at?: string;
}

export type UserType = User['user_type'];

export interface Profile extends User {
  phone?: string;
  address?: string;
  national_id?: string;
  profile_completed?: boolean;
  company_name?: string;
  commercial_register?: string;
  business_type?: string;
  business_address?: string;
  business_description?: string;
}