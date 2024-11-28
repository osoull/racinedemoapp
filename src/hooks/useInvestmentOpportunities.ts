import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useInvestmentOpportunities() {
  return useQuery({
    queryKey: ["investment-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_opportunities")
        .select(`
          *,
          funding_request:funding_requests (
            id,
            title,
            description,
            category,
            funding_goal,
            current_funding,
            risk_rating,
            risk_description,
            owner:profiles (
              id,
              first_name,
              last_name,
              company_name
            )
          )
        `)
        .eq("status", "active")

      if (error) throw error
      return data
    },
  })
}