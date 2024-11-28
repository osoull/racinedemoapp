import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"

export default function BorrowerDashboard() {
  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">لوحة المعلومات والإحصائيات</h2>
          <p className="text-muted-foreground">
            مرحباً بك في لوحة التحكم الخاصة بك
          </p>
        </div>
        <BorrowerDashboardOverview />
      </div>
    </DashboardLayout>
  )
}