import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function FundingChart() {
  const { data } = useQuery({
    queryKey: ["funding-chart"],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select("created_at, amount")
        .order("created_at")

      // Group by month and sum amounts
      const monthlyData = (data || []).reduce((acc: any[], inv) => {
        const month = new Date(inv.created_at).toLocaleString('ar-SA', { month: 'long' })
        const existing = acc.find(d => d.month === month)
        if (existing) {
          existing.amount += inv.amount
        } else {
          acc.push({ month, amount: inv.amount })
        }
        return acc
      }, [])

      return monthlyData
    }
  })

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>تطور التمويل</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#6E59A5" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}