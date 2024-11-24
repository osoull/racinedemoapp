import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface BankDetailsData {
  bank_name: string
  account_name: string
  swift: string
  iban: string
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
      
      const bankDetails = data.setting_value as BankDetailsData
      
      if (!bankDetails.bank_name || !bankDetails.account_name || 
          !bankDetails.swift || !bankDetails.iban) {
        throw new Error('Invalid bank details format')
      }
      
      return bankDetails
    }
  })
}