import { PlatformOverview } from "@/components/dashboard/overview/PlatformOverview"
import { FeesChart } from "@/components/admin/finance/FeesChart"
import { FundingChart } from "@/components/dashboard/charts/FundingChart"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Index() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Vue d'ensemble de la plateforme */}
      <PlatformOverview />

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Graphique des commissions */}
        <FeesChart />
        
        {/* Graphique du financement */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>تحليل التمويل</CardTitle>
          </CardHeader>
          <CardContent>
            <FundingChart />
          </CardContent>
        </Card>
      </div>

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