import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"

export default function BorrowerDashboard() {
  return (
    <div className="space-y-6">
      <BorrowerDashboardOverview />
    </div>
  )
}