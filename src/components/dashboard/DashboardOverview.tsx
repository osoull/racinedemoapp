import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Briefcase, Wallet, ArrowUp, ArrowDown } from "lucide-react"
import { ActivityFeed } from "./activity/ActivityFeed"
import { StatsGrid } from "./stats/StatsGrid"
import { FundingChart } from "./charts/FundingChart"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DataTable } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"

export function DashboardOverview() {
  const { toast } = useToast()

  const { data: platformStats, refetch: refetchStats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data: stats, error } = await supabase.rpc('calculate_platform_stats')
      if (error) throw error
      return stats
    }
  })

  const { data: activeProjects } = useQuery({
    queryKey: ["active-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          current_funding,
          funding_goal,
          owner:profiles(first_name, last_name),
          risk_rating
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    }
  })

  // Subscribe to real-time updates
  useRealtimeSubscription(
    ['projects', 'investments', 'transactions'],
    {
      onInsert: () => {
        refetchStats()
        toast({
          title: "تم تحديث البيانات",
          description: "تم تحديث إحصائيات المنصة"
        })
      },
      onUpdate: () => {
        refetchStats()
      }
    }
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-6">نظرة عامة على المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className={`text-sm font-medium ${platformStats?.investment_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {platformStats?.investment_growth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {Math.abs(platformStats?.investment_growth || 0)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">إجمالي الاستثمارات</p>
              <h3 className="text-2xl font-bold">{formatCurrency(platformStats?.total_investments || 0)}</h3>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-green-600">
                <ArrowUp className="h-4 w-4" />
                {platformStats?.investor_growth || 0}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">المستثمرون النشطون</p>
              <h3 className="text-2xl font-bold">{platformStats?.active_investors || 0}</h3>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-50 rounded-full">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <div className={`text-sm font-medium ${platformStats?.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {platformStats?.revenue_growth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {Math.abs(platformStats?.revenue_growth || 0)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold">{formatCurrency(platformStats?.total_revenue || 0)}</h3>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-orange-50 rounded-full">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-sm font-medium text-green-600">
                <ArrowUp className="h-4 w-4" />
                {platformStats?.project_growth || 0}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">المشاريع النشطة</p>
              <h3 className="text-2xl font-bold">{platformStats?.active_projects || 0}</h3>
            </div>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">تطور الاستثمارات</h3>
          <FundingChart />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">توزيع المشاريع حسب التصنيف</h3>
          <div className="h-[300px]">
            {/* ProjectDistributionChart component will be implemented later */}
          </div>
        </Card>
      </section>

      {/* Active Projects and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">المشاريع النشطة</h3>
            <span className="text-sm text-muted-foreground">{activeProjects?.length || 0} مشروع</span>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {activeProjects?.map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{project.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>المالك: {project.owner.first_name} {project.owner.last_name}</span>
                      <span>•</span>
                      <span>تقييم المخاطر: {project.risk_rating || 'غير محدد'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 rounded-full bg-primary-100">
                      <div 
                        className="h-full rounded-full bg-primary"
                        style={{ 
                          width: `${Math.min(100, (project.current_funding / project.funding_goal) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[4rem] text-left">
                      {Math.round((project.current_funding / project.funding_goal) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">النشاط الأخير</h3>
          </div>
          <ScrollArea className="h-[400px]">
            <ActivityFeed />
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}