import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Bar,
  BarChart,
  ComposedChart
} from 'recharts'
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

const COLORS = ['#6E59A5', '#9b87f5', '#D6BCFA', '#7E69AB'];

export function FundingChart() {
  const [timeRange, setTimeRange] = useState('month');

  const { data: monthlyData } = useQuery({
    queryKey: ["funding-chart", timeRange],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select(`
          amount,
          created_at,
          project:projects(
            title,
            funding_goal,
            current_funding
          )
        `)
        .order('created_at')

      // Group by month and sum amounts
      const grouped = (data || []).reduce((acc: any[], inv) => {
        const month = new Date(inv.created_at).toLocaleString('ar-SA', { month: 'long' })
        const existing = acc.find(d => d.month === month)
        if (existing) {
          existing.amount += inv.amount
          existing.count += 1
        } else {
          acc.push({ month, amount: inv.amount, count: 1 })
        }
        return acc
      }, [])

      return grouped
    }
  })

  const { data: projectStats } = useQuery({
    queryKey: ["project-funding-stats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select('title, funding_goal, current_funding')
        .not('current_funding', 'is', null)
        .order('current_funding', { ascending: false })
        .limit(5)

      return data?.map(project => ({
        name: project.title,
        value: project.current_funding,
        goal: project.funding_goal,
        percentage: ((project.current_funding || 0) / project.funding_goal) * 100
      }))
    }
  })

  return (
    <div className="space-y-4">
      <select 
        className="text-sm border rounded-md px-2 py-1"
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
      >
        <option value="week">آخر 7 أيام</option>
        <option value="month">آخر 30 يوم</option>
        <option value="year">هذه السنة</option>
      </select>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">التطور الزمني</TabsTrigger>
          <TabsTrigger value="projects">المشاريع الأعلى تمويلاً</TabsTrigger>
          <TabsTrigger value="combined">نظرة شاملة</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M ريال`, "التمويل"]}
                labelFormatter={(label) => `شهر ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#6E59A5" 
                strokeWidth={2}
                dot={{ fill: "#6E59A5", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#6E59A5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="projects" className="h-[400px]">
          <div className="grid grid-cols-2 gap-4 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {projectStats?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${(Number(value) / 1000000).toFixed(1)}M ريال`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectStats}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => `${(Number(value) / 1000000).toFixed(1)}M ريال`} />
                <Bar dataKey="value" fill="#6E59A5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="combined" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" dataKey="count" />
              <Tooltip formatter={(value, name) => {
                if (name === "amount") return `${(Number(value) / 1000000).toFixed(1)}M ريال`
                return value
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#6E59A5" name="قيمة التمويل" />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#9b87f5" name="عدد الاستثمارات" />
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}