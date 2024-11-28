import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminFeesManagement } from "./AdminFeesManagement"
import { FinancialReports } from "./FinancialReports"
import { InvestmentTracking } from "./InvestmentTracking"
import { BorrowerPayments } from "./BorrowerPayments"

export function FinanceOverview() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>الإدارة المالية</CardTitle>
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
              <AdminFeesManagement />
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