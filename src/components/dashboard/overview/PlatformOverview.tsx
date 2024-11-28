import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Users, TrendingUp, Wallet, Target } from "lucide-react"
import { PlatformStats } from "@/types/supabase"

export function PlatformOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_platform_stats')
      if (error) throw error
      return (data as unknown[])[0] as PlatformStats
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">نظرة عامة</h2>
        <p className="text-muted-foreground">
          إحصائيات ومؤشرات أداء المنصة
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              المستثمرون النشطون
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_investors || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.investor_growth > 0 ? "+" : ""}{stats?.investor_growth || 0}% منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الاستثمارات
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_investments || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.investment_growth > 0 ? "+" : ""}{stats?.investment_growth || 0}% منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الإيرادات
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.revenue_growth > 0 ? "+" : ""}{stats?.revenue_growth || 0}% منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الفرص النشطة
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_opportunities || 0}</div>
            <p className="text-xs text-muted-foreground">
              متوسط الاستثمار: {formatCurrency(stats?.average_investment_size || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}