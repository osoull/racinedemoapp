import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function ProjectsDistributionChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["funding-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_funding_request_stats")
      if (error) throw error
      return data[0]
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const chartData = stats?.requests_by_category 
    ? Object.entries(stats.requests_by_category).map(([name, value]) => ({
        name,
        value: typeof value === 'number' ? value : 0
      }))
    : []

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>توزيع المشاريع حسب الفئة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}