import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FundingOverview } from "./overview/FundingOverview"
import { FundingRequestList } from "./FundingRequestList"
import { FundingAnalytics } from "./analytics/FundingAnalytics"

export function FundingManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة طلبات التمويل</h2>
        <p className="text-muted-foreground">
          إدارة ومراجعة طلبات التمويل وتحليل الأداء
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="requests">قائمة الطلبات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <FundingOverview />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <FundingRequestList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <FundingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}