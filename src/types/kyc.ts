export interface BankAccountDetails {
  bank_name: string;
  account_number: string;
  iban: string;
}

export interface KYCFormData {
  id: string;
  company_registration_date: string;
  company_registration_number: string;
  tax_identification_number: string;
  legal_representative_name: string;
  legal_representative_id: string;
  annual_revenue: number;
  number_of_employees: number;
  industry_sector: string;
  company_website: string;
  bank_account_details: BankAccountDetails;
  verification_status?: string;
  updated_at?: string;
}