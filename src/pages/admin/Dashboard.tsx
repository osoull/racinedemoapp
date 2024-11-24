import { Routes, Route } from "react-router-dom"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import CommissionManagement from "@/components/admin/CommissionManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"

export default function AdminDashboard() {
  return (
    <div className="relative min-h-screen">
      <AdminSidebar />
      <div className="lg:pl-72">
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="commissions" element={<CommissionManagement />} />
            <Route path="compliance" element={<ComplianceAudit />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}