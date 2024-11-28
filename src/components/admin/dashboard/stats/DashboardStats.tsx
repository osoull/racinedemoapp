import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Users, TrendingUp, AlertCircle, FileCheck } from "lucide-react"

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["funding-stats"],
    queryFn: async () => {
      const [fundingStats, platformStats] = await Promise.all([
        supabase.rpc("calculate_funding_request_stats").then(res => res.data?.[0] || {}),
        supabase.rpc("calculate_platform_stats").then(res => res.data?.[0] || {})
      ])
      return {
        ...fundingStats,
        active_users: platformStats.active_investors || 0
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_requests || 0}</div>
          <div className="text-xs text-muted-foreground">
            {stats?.approved_requests || 0} تمت الموافقة عليها
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي التمويل</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(stats?.total_amount_approved || 0).toLocaleString()} ريال
          </div>
          <div className="text-xs text-muted-foreground">
            نسبة النجاح: {(((stats?.approved_requests || 0) / (stats?.total_requests || 1)) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المشاريع قيد المراجعة</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.pending_requests || 0}</div>
          <div className="text-xs text-muted-foreground">
            {stats?.rejected_requests || 0} تم رفضها
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.active_users || 0}</div>
        </CardContent>
      </Card>
    </div>
  )
}