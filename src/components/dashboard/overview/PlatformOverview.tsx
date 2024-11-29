import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Users, TrendingUp, Wallet, FileCheck, ArrowUp, ArrowDown } from "lucide-react"
import { PlatformStats } from "@/types/supabase"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export function PlatformOverview() {
  const { toast } = useToast()
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_platform_stats')
      if (error) throw error
      return (data as unknown[])[0] as PlatformStats
    }
  })

  useEffect(() => {
    // Subscribe to changes in platform_statistics and transactions
    const platformStatsChannel = supabase
      .channel('platform-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_statistics'
        },
        () => {
          refetch()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          refetch()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          toast({
            title: "تم تفعيل التحديثات المباشرة",
            description: "سيتم تحديث البيانات تلقائياً عند حدوث أي تغيير"
          })
        }
      })

    return () => {
      platformStatsChannel.unsubscribe()
    }
  }, [refetch, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">نظرة عامة</h2>
        <p className="text-muted-foreground mt-2">
          مؤشرات الأداء الرئيسية للمنصة
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* المستثمرون النشطون */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">المستثمرون النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold">{stats?.active_investors.toLocaleString()}</div>
              <div className={`text-xs flex items-center gap-1 ${stats?.investor_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.investor_growth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {formatPercentage(stats?.investor_growth || 0)}
                <span className="text-muted-foreground mr-1">منذ الشهر الماضي</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إجمالي الاستثمارات */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">إجمالي الاستثمارات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold">{formatCurrency(stats?.total_investments || 0)}</div>
              <div className={`text-xs flex items-center gap-1 ${stats?.investment_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.investment_growth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {formatPercentage(stats?.investment_growth || 0)}
                <span className="text-muted-foreground mr-1">منذ الشهر الماضي</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إجمالي الإيرادات */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
              <div className={`text-xs flex items-center gap-1 ${stats?.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.revenue_growth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {formatPercentage(stats?.revenue_growth || 0)}
                <span className="text-muted-foreground mr-1">منذ الشهر الماضي</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* المشاريع الممولة */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">المشاريع الممولة</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold">{stats?.funded_projects || 0}</div>
              <div className="text-xs text-muted-foreground">
                متوسط التمويل: {formatCurrency(stats?.average_investment_size || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}