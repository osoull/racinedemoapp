import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"

export default function BorrowerDashboard() {
  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <BorrowerDashboardOverview />
    </DashboardLayout>
  )
}