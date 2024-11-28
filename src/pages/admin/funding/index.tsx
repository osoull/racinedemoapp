import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { FundingManagement } from "@/components/admin/funding/FundingManagement"

export default function FundingManagementPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <FundingManagement />
    </DashboardLayout>
  )
}