import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { RevenueSummary } from "../revenue/RevenueSummary"
import { RevenueTable } from "../revenue/RevenueTable"

export function FinanceOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["finance-overview"],
    queryFn: async () => {
      const { data: revenueData, error: revenueError } = await supabase
        .rpc('calculate_revenue_by_period', {
          start_date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
          end_date: new Date().toISOString()
        })

      if (revenueError) throw revenueError

      const { data: platformStats, error: statsError } = await supabase
        .rpc('calculate_platform_stats')

      if (statsError) throw statsError

      return {
        revenue: revenueData[0],
        platform: platformStats[0]
      }
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const totals = {
    admin_fees: stats.revenue.admin_fees,
    collection_fees: stats.revenue.collection_fees,
    basic_investor_fees: stats.revenue.basic_investor_fees,
    qualified_investor_fees: stats.revenue.qualified_investor_fees,
    total_fees: stats.revenue.total_fees
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاستثمارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.platform.total_investments.toLocaleString()} ريال
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.platform.investment_growth >= 0 ? "+" : ""}
              {stats.platform.investment_growth.toFixed(1)}% عن العام السابق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستثمرون النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.platform.active_investors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.platform.investor_growth >= 0 ? "+" : ""}
              {stats.platform.investor_growth.toFixed(1)}% عن العام السابق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.platform.total_revenue.toLocaleString()} ريال
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.platform.revenue_growth >= 0 ? "+" : ""}
              {stats.platform.revenue_growth.toFixed(1)}% عن العام السابق
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الإيرادات</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueSummary totals={totals} />
        </CardContent>
      </Card>
    </div>
  )
}