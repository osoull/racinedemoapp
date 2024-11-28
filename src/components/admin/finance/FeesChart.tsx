import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from "lucide-react"

export function FeesChart() {
  const { data: feesData, isLoading } = useQuery({
    queryKey: ["fees-chart"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        'calculate_revenue_by_period',
        {
          start_date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
          end_date: new Date().toISOString()
        }
      )

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const chartData = feesData?.map(item => ({
    name: item.period,
    'رسوم الإدارة': item.admin_fees,
    'رسوم التحصيل': item.collection_fees,
    'رسوم المستثمرين': item.basic_investor_fees + item.qualified_investor_fees
  }))

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>تتبع الرسوم</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="رسوم الإدارة" fill="#0ea5e9" />
              <Bar dataKey="رسوم التحصيل" fill="#22c55e" />
              <Bar dataKey="رسوم المستثمرين" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}