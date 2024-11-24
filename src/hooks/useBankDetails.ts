import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface BankDetailsData {
  bank_name: string
  account_name: string
  swift: string
  iban: string
}

const isBankDetailsData = (data: unknown): data is BankDetailsData => {
  if (!data || typeof data !== 'object') return false
  
  const bankDetails = data as Record<string, unknown>
  return typeof bankDetails.bank_name === 'string' &&
         typeof bankDetails.account_name === 'string' &&
         typeof bankDetails.swift === 'string' &&
         typeof bankDetails.iban === 'string'
}

export function useBankDetails() {
  return useQuery({
    queryKey: ['platform_bank_details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'platform_bank_details')
        .single()

      if (error) throw error
      
      const bankDetails = data.setting_value
      
      if (!isBankDetailsData(bankDetails)) {
        throw new Error('Invalid bank details format')
      }
      
      return bankDetails
    }
  })
}