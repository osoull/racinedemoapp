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
    queryKey: ['platform_bank_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_bank_accounts')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching bank details:', error)
        throw new Error('Failed to load bank details')
      }
      
      if (!data) {
        return null
      }

      return {
        bank_name: data.bank_name,
        account_name: data.account_name,
        swift: data.swift || '',
        iban: data.iban
      }
    }
  })
}