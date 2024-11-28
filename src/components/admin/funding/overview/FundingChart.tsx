import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from "lucide-react"

export function FundingChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["funding-monthly-stats"],
    queryFn: async () => {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 11)
      
      const { data, error } = await supabase.rpc(
        'calculate_funding_request_stats',
        { 
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString()
        }
      )
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_requests" fill="#8884d8" name="عدد الطلبات" />
          <Bar dataKey="approved_requests" fill="#82ca9d" name="الطلبات المعتمدة" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}