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
            
            {/* User Management Routes */}
            <Route path="users/*" element={<UserManagement />} />
            <Route path="users/investors" element={<UserManagement filter="investor" />} />
            <Route path="users/project-owners" element={<UserManagement filter="project_owner" />} />
            <Route path="users/managers" element={<UserManagement filter="investment_manager" />} />
            
            {/* Project Management Routes */}
            <Route path="projects/*" element={<ProjectManagement />} />
            <Route path="projects/new" element={<ProjectManagement filter="pending" />} />
            <Route path="projects/active" element={<ProjectManagement filter="active" />} />
            <Route path="projects/completed" element={<ProjectManagement filter="completed" />} />
            
            {/* Commission Management Routes */}
            <Route path="commissions/*" element={<CommissionManagement />} />
            <Route path="commissions/structure" element={<CommissionManagement view="structure" />} />
            <Route path="commissions/history" element={<CommissionManagement view="history" />} />
            
            {/* Compliance Routes */}
            <Route path="compliance/*" element={<ComplianceAudit />} />
            <Route path="kyc/*" element={<ComplianceAudit tab="kyc" />} />
            <Route path="sharia/*" element={<ComplianceAudit tab="sharia" />} />
            <Route path="cma/*" element={<ComplianceAudit tab="cma" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}