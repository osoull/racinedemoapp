export interface Investor {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  kyc_status: string
  user_type: string
  investor_kyc: {
    verification_status: string
  } | null
}