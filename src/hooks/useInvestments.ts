import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Investment } from "@/types/investment"

export function useInvestments() {
  return useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:profiles(
            id,
            first_name,
            last_name
          ),
          investment:investment_opportunities(
            id,
            funding_request:funding_requests(
              title,
              description
            )
          ),
          stripe_payments(
            stripe_session_id,
            status
          ),
          bank_transactions(
            bank_status,
            reference_number
          )
        `)
        .eq("type", "investment")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Investment[]
    }
  })
}