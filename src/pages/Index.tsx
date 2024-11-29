import { PlatformOverview } from "@/components/dashboard/overview/PlatformOverview"
import { FeesChart } from "@/components/admin/finance/FeesChart"
import { FundingChart } from "@/components/dashboard/charts/FundingChart"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Index() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-800">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          نظرة عامة على أداء المنصة والإحصائيات الرئيسية
        </p>
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