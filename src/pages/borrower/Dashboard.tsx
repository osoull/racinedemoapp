import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"

export default function BorrowerDashboard() {
  return (
    <BorrowerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">لوحة المعلومات والإحصائيات</h2>
          <p className="text-muted-foreground">
            مرحباً بك في لوحة التحكم الخاصة بك
          </p>
        </div>
        <BorrowerDashboardOverview />
      </div>
    </BorrowerDashboardLayout>
  )
}