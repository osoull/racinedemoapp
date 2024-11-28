import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { RevenueByPeriod } from "@/types/supabase"

export function FeesChart() {
  const { data: feesData, isLoading } = useQuery({
    queryKey: ["fees-chart"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_revenue_by_period', {
        start_date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
        end_date: new Date().toISOString()
      })

      if (error) throw error
      return data as RevenueByPeriod[]
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const chartData = feesData?.map(period => ({
    name: period.period,
    'عمولة الإدارة': period.admin_fees,
    'عمولة التحصيل': period.collection_fees,
    'عمولة المستثمر الأساسي': period.basic_investor_fees,
    'عمولة المستثمر المؤهل': period.qualified_investor_fees
  })) || []

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>تحليل العمولات</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="عمولة الإدارة" fill="#8884d8" />
              <Bar dataKey="عمولة التحصيل" fill="#82ca9d" />
              <Bar dataKey="عمولة المستثمر الأساسي" fill="#ffc658" />
              <Bar dataKey="عمولة المستثمر المؤهل" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}