import { Card } from "@/components/ui/card"
import { Briefcase, Users, Wallet, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { usePlatformStats } from "@/hooks/usePlatformStats"

export function StatsGrid() {
  const { stats, isLoading } = usePlatformStats()

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

  const formatCurrency = (amount: number) => {
    const millions = amount / 1000000
    return `${millions.toFixed(1)} مليون ريال`
  }

  const items = [
    {
      title: "إجمالي التمويل",
      value: formatCurrency(stats?.totalInvestment || 0),
      icon: TrendingUp,
      trend: { value: 8.3, isPositive: true },
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "المستثمرين النشطين",
      value: stats?.totalInvestors || 0,
      icon: Users,
      trend: { value: 15.2, isPositive: true },
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "حجم المعاملات",
      value: formatCurrency(stats?.transactionVolume || 0),
      icon: Wallet,
      trend: { value: 4.1, isPositive: false },
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "المشاريع النشطة",
      value: stats?.activeProjects || 0,
      icon: Briefcase,
      trend: { value: 12.5, isPositive: true },
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