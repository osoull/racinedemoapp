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
          user:profiles!transactions_user_id_fkey(
            id,
            first_name,
            last_name
          ),
          funding_request:funding_requests(
            id,
            title,
            description,
            funding_goal,
            current_funding,
            status
          )
        `)
        .eq("type", "investment")
        .order("created_at", { ascending: false })

      if (error) throw error

      return data as Investment[]
    }
  })
}