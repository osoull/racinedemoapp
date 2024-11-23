export type UserType = "investor" | "project_owner" | "investment_manager" | "admin";

export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  user_type: UserType | null;
  kyc_status: string | null;
  national_id: string | null;
  created_at: string;
}