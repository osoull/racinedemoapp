import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { useLocation } from "react-router-dom"

const AdminDashboard = () => {
  const location = useLocation()

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        {location.pathname === "/admin" && <DashboardOverview />}
        {/* Add other routes content here */}
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
