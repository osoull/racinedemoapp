import { Card } from "@/components/ui/card"
import { Briefcase, Users, Wallet, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface StatsData {
  projects: number
  totalFunding: number
  investors: number
  transactions: number
}

export function StatsGrid() {
  const { user } = useAuth()

  const { data: stats } = useQuery<StatsData>({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      const { data: projectsCount } = await supabase
        .from("projects")
        .select("count")
        .eq("status", "active")

      const { data: investmentsSum } = await supabase
        .from("investments")
        .select("sum(amount)")
        .eq("status", "confirmed")

      const { data: investorsCount } = await supabase
        .from("profiles")
        .select("count")
        .eq("user_type", "investor")

      const { data: transactionsSum } = await supabase
        .from("transactions")
        .select("sum(amount)")
        .eq("status", "completed")

      return {
        projects: Number(projectsCount?.[0]?.count || 0),
        totalFunding: Number(investmentsSum?.[0]?.sum || 0),
        investors: Number(investorsCount?.[0]?.count || 0),
        transactions: Number(transactionsSum?.[0]?.sum || 0)
      }
    },
    enabled: !!user?.id
  })

  const items = [
    {
      title: "المشاريع النشطة",
      value: stats?.projects || 0,
      icon: Briefcase,
      trend: { value: 12.5, isPositive: true },
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "إجمالي التمويل",
      value: `${((Number(stats?.totalFunding) || 0) / 1000000).toFixed(1)} مليون ريال`,
      icon: Wallet,
      trend: { value: 8.3, isPositive: true },
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "المستثمرين النشطين",
      value: stats?.investors || 0,
      icon: Users,
      trend: { value: 15.2, isPositive: true },
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "حجم المعاملات",
      value: `${((Number(stats?.transactions) || 0) / 1000000).toFixed(1)} مليون ريال`,
      icon: TrendingUp,
      trend: { value: 4.1, isPositive: false },
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
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
                {item.trend.isPositive ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{item.trend.value}%</span>
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