import { Card } from "@/components/ui/card"
import { ActivityFeed } from "./activity/ActivityFeed"
import { FundingChart } from "./charts/FundingChart"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { PlatformStats } from "./stats/PlatformStats"

export function DashboardOverview() {
  const { toast } = useToast()

  const { data: platformStats, refetch: refetchStats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_platform_stats')
      if (error) throw error
      return data?.[0] || null
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

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-6">نظرة عامة على المنصة</h2>
        <PlatformStats stats={platformStats} isLoading={isLoading} />
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
