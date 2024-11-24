import { InvestorManagement } from "@/components/admin/investors/InvestorManagement"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function InvestorsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <InvestorManagement />
    </DashboardLayout>
  )
}