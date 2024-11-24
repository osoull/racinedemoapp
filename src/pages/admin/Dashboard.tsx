import { Routes, Route } from "react-router-dom"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import PlatformSettings from "@/components/admin/platform/PlatformSettings"

export default function AdminDashboard() {
  return (
    <div className="relative min-h-screen">
      <AdminSidebar />
      <div className="lg:pl-72">
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardOverview />} />
            
            {/* Platform Settings Routes */}
            <Route path="platform-settings/*" element={<PlatformSettings />} />
            <Route path="platform-settings/general" element={<PlatformSettings section="general" />} />
            <Route path="platform-settings/commissions" element={<PlatformSettings section="commissions" />} />
            <Route path="platform-settings/security" element={<PlatformSettings section="security" />} />
            <Route path="platform-settings/users" element={<PlatformSettings section="users" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}