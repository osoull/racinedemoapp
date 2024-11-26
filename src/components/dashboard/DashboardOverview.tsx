import { Card } from "@/components/ui/card"
import { ActivityFeed } from "./activity/ActivityFeed"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, TrendingUp, Users, Briefcase } from "lucide-react"

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

  const { data: monthlyData } = useQuery({
    queryKey: ["monthly-investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('amount, created_at')
        .order('created_at')
      
      if (error) throw error

      // Group by month
      const grouped = (data || []).reduce((acc: any[], inv) => {
        const month = new Date(inv.created_at).toLocaleString('ar-SA', { month: 'long' })
        const existing = acc.find(d => d.month === month)
        if (existing) {
          existing.amount += inv.amount
        } else {
          acc.push({ month, amount: inv.amount })
        }
        return acc
      }, [])

      return grouped
    }
  })

  // Subscribe to real-time updates
  useRealtimeSubscription(
    ['projects', 'investments', 'transactions'],
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
      title: "إجمالي الاستثمارات",
      value: platformStats?.total_investments?.toLocaleString() + " ريال" || "0 ريال",
      icon: Wallet,
      change: platformStats?.investment_growth || 0,
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "المستثمرون النشطون",
      value: platformStats?.active_investors?.toString() || "0",
      icon: Users,
      change: platformStats?.investor_growth || 0,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "المشاريع النشطة",
      value: platformStats?.active_projects?.toString() || "0",
      icon: Briefcase,
      change: platformStats?.project_growth || 0,
      color: "bg-green-100 text-green-700"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">تطور الاستثمارات</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="قيمة الاستثمارات"
                  stroke="#6E59A5" 
                  strokeWidth={2}
                  dot={{ fill: "#6E59A5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

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
      </div>

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