import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { FinanceOverview } from "@/components/admin/finance/FinanceOverview"

export default function FinancePage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الإدارة المالية</h2>
          <p className="text-muted-foreground">
            إدارة الإيرادات والمعاملات المالية للمنصة
          </p>
        </div>
        <FinanceOverview />
      </div>
    </DashboardLayout>
  )
}