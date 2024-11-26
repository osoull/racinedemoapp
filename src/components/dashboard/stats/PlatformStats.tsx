import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Briefcase, Wallet, ArrowUp, ArrowDown } from "lucide-react"

interface PlatformStatsProps {
  stats: {
    total_investments: number
    investment_growth: number
    active_investors: number
    investor_growth: number
    total_revenue: number
    revenue_growth: number
    active_projects: number
    project_growth: number
  } | null
  isLoading: boolean
}

export function PlatformStats({ stats, isLoading }: PlatformStatsProps) {
  if (isLoading || !stats) {
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
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-primary/10 rounded-full">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div className={`text-sm font-medium ${stats.investment_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.investment_growth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {Math.abs(stats.investment_growth)}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">إجمالي الاستثمارات</p>
          <h3 className="text-2xl font-bold">{formatCurrency(stats.total_investments)}</h3>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-blue-50 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-sm font-medium text-green-600">
            <ArrowUp className="h-4 w-4" />
            {stats.investor_growth}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">المستثمرون النشطون</p>
          <h3 className="text-2xl font-bold">{stats.active_investors}</h3>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-purple-50 rounded-full">
            <Wallet className="h-6 w-6 text-purple-600" />
          </div>
          <div className={`text-sm font-medium ${stats.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.revenue_growth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {Math.abs(stats.revenue_growth)}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
          <h3 className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</h3>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-orange-50 rounded-full">
            <Briefcase className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-sm font-medium text-green-600">
            <ArrowUp className="h-4 w-4" />
            {stats.project_growth}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">المشاريع النشطة</p>
          <h3 className="text-2xl font-bold">{stats.active_projects}</h3>
        </div>
      </Card>
    </div>
  )
}