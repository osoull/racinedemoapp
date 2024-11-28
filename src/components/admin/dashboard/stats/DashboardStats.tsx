import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Users, TrendingUp, AlertCircle, FileCheck } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type FundingStats = Database["public"]["Functions"]["calculate_funding_request_stats"]["Returns"][0]
type PlatformStats = Database["public"]["Functions"]["calculate_platform_stats"]["Returns"][0]

interface CombinedStats extends FundingStats {
  active_users: number
}

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["funding-stats"],
    queryFn: async () => {
      const [{ data: fundingStats }, { data: platformStats }] = await Promise.all([
        supabase.rpc("calculate_funding_request_stats"),
        supabase.rpc("calculate_platform_stats")
      ])

      return {
        ...(fundingStats?.[0] || {}),
        active_users: platformStats?.[0]?.active_investors || 0
      } as CombinedStats
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const defaultStats: CombinedStats = {
    total_requests: 0,
    approved_requests: 0,
    rejected_requests: 0,
    pending_requests: 0,
    total_amount_requested: 0,
    total_amount_approved: 0,
    total_fees_collected: 0,
    requests_by_category: {},
    requests_by_status: {},
    active_users: 0
  }

  const safeStats = stats || defaultStats

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.total_requests}</div>
          <div className="text-xs text-muted-foreground">
            {safeStats.approved_requests} تمت الموافقة عليها
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
            {safeStats.total_amount_approved.toLocaleString()} ريال
          </div>
          <div className="text-xs text-muted-foreground">
            نسبة النجاح: {((safeStats.approved_requests / Math.max(safeStats.total_requests, 1)) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المشاريع قيد المراجعة</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.pending_requests}</div>
          <div className="text-xs text-muted-foreground">
            {safeStats.rejected_requests} تم رفضها
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.active_users}</div>
        </CardContent>
      </Card>
    </div>
  )
}