import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface BankDetailsData {
  bank_name: string
  account_name: string
  swift: string
  iban: string
}

export function useBankDetails() {
  const query = useQuery({
    queryKey: ['bank_accounts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single()

      if (error) {
        console.error('Error fetching bank details:', error)
        throw new Error('Failed to load bank details')
      }
      
      return data ? {
        bank_name: data.bank_name,
        account_name: data.account_name,
        swift: data.swift || '',
        iban: data.iban
      } : null
    }
  })

  return query
}