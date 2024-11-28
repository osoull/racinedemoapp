import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from "lucide-react"

export function TrendAnalysis() {
  const { data: trends, isLoading } = useQuery({
    queryKey: ["funding-trends"],
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
        <LineChart data={trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_amount_requested" stroke="#8884d8" name="المبلغ المطلوب" />
          <Line type="monotone" dataKey="total_amount_approved" stroke="#82ca9d" name="المبلغ المعتمد" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}