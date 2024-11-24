import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { useLocation } from "react-router-dom"

const AdminDashboard = () => {
  const location = useLocation()

  return (
    <DashboardLayout className="p-0">
      <div className="w-full">
        {location.pathname === "/admin" && <DashboardOverview />}
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard