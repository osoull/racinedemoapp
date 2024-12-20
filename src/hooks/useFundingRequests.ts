import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { FundingRequest } from "@/types/funding"

export const useFundingRequests = (userId?: string) => {
  return useQuery({
    queryKey: ["funding-requests", userId],
    queryFn: async () => {
      let query = supabase
        .from("funding_requests")
        .select(`
          *,
          owner:profiles!funding_requests_owner_id_fkey(
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false })

      if (userId) {
        query = query.eq("owner_id", userId)
      }

      const { data, error } = await query
      if (error) throw error
      return data as FundingRequest[]
    },
    enabled: !userId || !!userId,
  })
}