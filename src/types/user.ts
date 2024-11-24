export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'investor' | 'project_owner' | 'admin' | 'investment_manager';
  kyc_status?: string;
  created_at: string;
}

export type UserType = User['user_type'];