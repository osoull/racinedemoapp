import { Card } from "@/components/ui/card"
import { ActivityFeed } from "./activity/ActivityFeed"
import { useQuery } from "@tanstack/react-query"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Wallet, TrendingUp, Users } from "lucide-react"

const COLORS = ['#6E59A5', '#9b87f5', '#D6BCFA', '#7E69AB']

export function DashboardOverview() {
  const { toast } = useToast()

  const { data: platformStats, refetch: refetchStats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_platform_stats')
      if (error) throw error
      return data?.[0] || null
    }
  })

  // Subscribe to real-time updates
  useRealtimeSubscription(
    ['transactions'],
    {
      onInsert: () => {
        refetchStats()
        toast({
          title: "تم تحديث البيانات",
          description: "تم تحديث إحصائيات المنصة"
        })
      },
      onUpdate: () => {
        refetchStats()
      }
    }
  )

  const statCards = [
    {
      title: "المستثمرون النشطون",
      value: platformStats?.active_investors?.toString() || "0",
      icon: Users,
      change: platformStats?.investor_growth || 0,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "إجمالي الإيرادات",
      value: platformStats?.total_revenue?.toLocaleString() + " ريال" || "0 ريال",
      icon: TrendingUp,
      change: platformStats?.revenue_growth || 0,
      color: "bg-orange-100 text-orange-700"
    }
  ]

  return (
    <div className="space-y-8 p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`text-sm font-medium ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm text-muted-foreground">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">توزيع الإيرادات</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'رسوم إدارية', value: platformStats?.total_revenue * 0.4 || 0 },
                  { name: 'رسوم تحصيل', value: platformStats?.total_revenue * 0.3 || 0 },
                  { name: 'رسوم المستثمرين', value: platformStats?.total_revenue * 0.3 || 0 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">النشاط الأخير</h3>
        </div>
        <ScrollArea className="h-[400px]">
          <ActivityFeed />
        </ScrollArea>
      </Card>
    </div>
  )
}