import { PlatformOverview } from "@/components/dashboard/overview/PlatformOverview"
import { FeesChart } from "@/components/admin/finance/FeesChart"
import { FundingChart } from "@/components/dashboard/charts/FundingChart"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"

export default function Index() {
  const { user } = useAuth()

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg">
          <h2 className="text-3xl font-bold tracking-tight text-primary-800">
            {profile?.first_name ? (
              <>مرحباً بك {profile.first_name} 👋</>
            ) : (
              "لوحة التحكم"
            )}
          </h2>
          <p className="text-muted-foreground mt-2">
            نتمنى لك يوماً مليئاً بالإنجازات! هذه نظرة عامة على أداء المنصة والإحصائيات الرئيسية
          </p>
        </div>
      </div>

      {/* Vue d'ensemble de la plateforme */}
      <PlatformOverview />
      
      {/* Graphique des commissions */}
      <Card>
        <CardHeader>
          <CardTitle>تحليل العمولات</CardTitle>
        </CardHeader>
        <CardContent>
          <FeesChart />
        </CardContent>
      </Card>
      
      {/* Graphique du financement */}
      <Card>
        <CardHeader>
          <CardTitle>تحليل التمويل</CardTitle>
        </CardHeader>
        <CardContent>
          <FundingChart />
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed />
        </CardContent>
      </Card>
    </div>
  )
}