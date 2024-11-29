import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { RevenueByPeriod } from "@/types/revenue"

export const useRevenueStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["revenue-stats"],
    queryFn: async () => {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 12)
      
      const { data, error } = await supabase.rpc('calculate_revenue_by_period', {
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      })

      if (error) throw error

      const revenueData = data as RevenueByPeriod[]

      // Calculate monthly growth
      const monthlyGrowth = revenueData && revenueData.length >= 2 
        ? ((revenueData[0].total_fees - revenueData[1].total_fees) / revenueData[1].total_fees) * 100
        : 0

      return {
        totalRevenue: revenueData?.[0]?.total_fees || 0,
        monthlyGrowth,
        revenueByPeriod: revenueData || [],
      }
    },
  })

  return { data, isLoading }
}
