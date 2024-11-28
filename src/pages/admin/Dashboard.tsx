import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview"

export default function AdminDashboard() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <DashboardOverview />
    </DashboardLayout>
  )
}