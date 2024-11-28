import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinancialReports } from "./FinancialReports"
import { BorrowerPayments } from "./BorrowerPayments"
import { FeesManagement } from "./FeesManagement"
import { TotalFeesCard } from "@/components/admin/revenue/TotalFeesCard"

export function FinanceOverview() {
  return (
    <div className="space-y-6">
      <TotalFeesCard />
      
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">التقارير المالية</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          <TabsTrigger value="fees">إدارة الرسوم</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <BorrowerPayments />
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <FeesManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}