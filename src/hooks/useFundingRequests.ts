import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const useFundingRequests = (userId?: string) => {
  return useQuery({
    queryKey: ["funding-requests", userId],
    queryFn: async () => {
      let query = supabase
        .from("funding_requests")
        .select(`
          *,
          owner:profiles(first_name, last_name)
        `)
        .order("created_at", { ascending: false })

      if (userId) {
        query = query.eq("owner_id", userId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !userId || !!userId,
  })
}