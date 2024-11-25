import { Card } from "@/components/ui/card"
import { Briefcase, Users, Wallet, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface StatsData {
  activeProjects: number
  totalFunding: number
  totalInvestors: number
  totalTransactions: number
  projectsGrowth: number
  fundingGrowth: number
  investorsGrowth: number
  transactionsGrowth: number
}

export function StatsGrid() {
  const { user } = useAuth()

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Fetch active projects count
      const { data: activeProjects } = await supabase
        .from("projects")
        .select("count")
        .eq("status", "active")

      // Fetch total funding
      const { data: investments } = await supabase
        .from("investments")
        .select("amount")
        .eq("status", "completed")

      // Fetch total investors
      const { data: investors } = await supabase
        .from("profiles")
        .select("count")
        .eq("user_type", "investor")

      // Fetch total transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("status", "completed")

      // Calculate total funding
      const totalFunding = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0

      // Calculate total transactions value
      const totalTransactions = transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0

      return {
        activeProjects: Number(activeProjects?.[0]?.count || 0),
        totalFunding,
        totalInvestors: Number(investors?.[0]?.count || 0),
        totalTransactions,
        // Note: Growth rates could be calculated by comparing with previous period
        // For now using placeholder values
        projectsGrowth: 12.5,
        fundingGrowth: 8.3,
        investorsGrowth: 15.2,
        transactionsGrowth: 4.1
      } as StatsData
    }
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-12 w-12 rounded-lg bg-muted"></div>
            <div className="mt-4 space-y-3">
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="h-6 w-3/4 bg-muted rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    {
      title: "المشاريع النشطة",
      value: stats?.activeProjects || 0,
      icon: Briefcase,
      trend: { value: stats?.projectsGrowth || 0, isPositive: true },
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "إجمالي التمويل",
      value: `${((stats?.totalFunding || 0) / 1000000).toFixed(1)} مليون ريال`,
      icon: Wallet,
      trend: { value: stats?.fundingGrowth || 0, isPositive: true },
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "المستثمرين النشطين",
      value: stats?.totalInvestors || 0,
      icon: Users,
      trend: { value: stats?.investorsGrowth || 0, isPositive: true },
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "حجم المعاملات",
      value: `${((stats?.totalTransactions || 0) / 1000000).toFixed(1)} مليون ريال`,
      icon: TrendingUp,
      trend: { value: stats?.transactionsGrowth || 0, isPositive: false },
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