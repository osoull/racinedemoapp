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
        .from('bank_accounts')
        .select('*')
        .eq('is_primary', true)
        .single()

      if (error) {
        // If no rows found, return null instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching bank details:', error)
        throw new Error('Failed to load bank details')
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