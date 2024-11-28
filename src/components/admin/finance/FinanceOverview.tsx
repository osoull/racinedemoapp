import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeesManagement } from "./FeesManagement"
import { FinancialReports } from "./FinancialReports"
import { InvestmentTracking } from "./InvestmentTracking"
import { BorrowerPayments } from "./BorrowerPayments"
import { FeesChart } from "./FeesChart"

export function FinanceOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الإدارة المالية</h2>
        <p className="text-muted-foreground">
          إدارة ومراقبة العمليات المالية للمنصة
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>رسوم المنصة</CardTitle>
          </CardHeader>
          <CardContent>
            <FeesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>متابعة الاستثمارات الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <InvestmentTracking showOnlyChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>تتبع المدفوعات الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BorrowerPayments showOnlyChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إدارة العمليات المالية</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fees" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fees">إدارة الرسوم</TabsTrigger>
              <TabsTrigger value="reports">التقارير المالية</TabsTrigger>
              <TabsTrigger value="investments">متابعة الاستثمارات</TabsTrigger>
              <TabsTrigger value="payments">مدفوعات المقترضين</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fees">
              <FeesManagement />
            </TabsContent>
            
            <TabsContent value="reports">
              <FinancialReports />
            </TabsContent>
            
            <TabsContent value="investments">
              <InvestmentTracking />
            </TabsContent>
            
            <TabsContent value="payments">
              <BorrowerPayments />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}