import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { RevenueByPeriod } from "@/types/supabase"

export const useRevenueStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["revenue-stats"],
    queryFn: async () => {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 12)
      
      const { data, error } = await supabase.rpc<RevenueByPeriod[]>(
        "calculate_revenue_by_period",
        {
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString(),
        }
      )

      if (error) throw error

      // Calculate monthly growth
      const monthlyGrowth = data && data.length >= 2 
        ? ((data[0].total_fees - data[1].total_fees) / data[1].total_fees) * 100
        : 0

      return {
        totalRevenue: data?.[0]?.total_fees || 0,
        monthlyGrowth,
        revenueByPeriod: data || [],
      }
    },
  })

  return {
    data,
    isLoading,
  }
}