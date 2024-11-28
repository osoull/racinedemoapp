import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { FundingRequestList } from "@/components/admin/funding/FundingRequestList"

export default function FundingRequestsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">طلبات التمويل</h2>
          <p className="text-muted-foreground">
            إدارة ومراجعة طلبات التمويل المقدمة
          </p>
        </div>

        <FundingRequestList />
      </div>
    </DashboardLayout>
  )
}