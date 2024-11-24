import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

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
  const query = useQuery({
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

  useEffect(() => {
    const channel = supabase
      .channel('platform_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'platform_settings',
          filter: 'setting_key=eq.platform_bank_details'
        },
        () => {
          query.refetch()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [query])

  return query
}