import { Card } from "@/components/ui/card"
import { Briefcase, Users, Wallet, TrendingUp } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export function StatsGrid() {
  const { user } = useAuth()

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      const { data: projects } = await supabase
        .from("projects")
        .select("count")
        .eq("status", "active")

      const { data: investments } = await supabase
        .from("investments")
        .select("sum(amount)")
        .eq("status", "confirmed")

      const { data: users } = await supabase
        .from("profiles")
        .select("count")
        .eq("user_type", "investor")

      return {
        projects: projects?.[0]?.count || 0,
        totalFunding: investments?.[0]?.sum || 0,
        investors: users?.[0]?.count || 0,
        growth: 24 // Example static value
      }
    },
    enabled: !!user?.id
  })

  const items = [
    {
      title: "التقارير",
      value: stats?.projects || 0,
      icon: Briefcase,
      trend: { value: 8.3, isPositive: true },
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      title: "المشاريع النشطة",
      value: `${(stats?.totalFunding || 0).toLocaleString()} ريال`,
      icon: Wallet,
      trend: { value: 12.5, isPositive: true },
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600"
    },
    {
      title: "إجمالي المستثمرين",
      value: stats?.investors || 0,
      icon: Users,
      trend: { value: 15.2, isPositive: true },
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "إجمالي التمويلات",
      value: "2.8 مليون ريال",
      icon: TrendingUp,
      trend: { value: 4.1, isPositive: true },
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.title} className="p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className={`rounded-xl ${item.bgColor} p-3`}>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </div>
            {item.trend && (
              <div className={`flex items-center gap-1 text-sm ${
                item.trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>+{item.trend.value}%</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  )
}