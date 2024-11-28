import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function StatsGrid() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('calculate_platform_stats')
        .single()

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            المستثمرون النشطون
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active_investors}</div>
          <p className="text-xs text-muted-foreground">
            {stats.investor_growth > 0 ? "+" : ""}{stats.investor_growth}% منذ الشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            إجمالي الإيرادات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_revenue.toLocaleString()} ريال</div>
          <p className="text-xs text-muted-foreground">
            {stats.revenue_growth > 0 ? "+" : ""}{stats.revenue_growth}% منذ الشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            إجمالي الاستثمارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_investments.toLocaleString()} ريال</div>
          <p className="text-xs text-muted-foreground">
            {stats.investment_growth > 0 ? "+" : ""}{stats.investment_growth}% منذ الشهر الماضي
          </p>
        </CardContent>
      </Card>
    </div>
  )
}