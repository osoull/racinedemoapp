import { Routes, Route } from "react-router-dom"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import PlatformSettings from "@/components/admin/PlatformSettings"
import CommissionManagement from "@/components/admin/CommissionManagement"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useLocation } from "react-router-dom"

export default function AdminDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const isOverviewPage = location.pathname === "/admin"

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user?.id)
        .single()
      return data
    },
    enabled: !!user?.id
  })

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        {isOverviewPage && profile?.first_name && (
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold">
              مرحباً بك {profile.first_name} في لوحة التحكم
            </h2>
          </div>
        )}

        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/investors" element={<UserManagement />} />
          <Route path="users/project-owners" element={<UserManagement />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="projects/new" element={<ProjectManagement />} />
          <Route path="projects/active" element={<ProjectManagement />} />
          <Route path="projects/completed" element={<ProjectManagement />} />
          <Route path="kyc" element={<ComplianceAudit tab="kyc" />} />
          <Route path="sharia" element={<ComplianceAudit tab="sharia" />} />
          <Route path="platform-settings" element={<PlatformSettings />} />
          <Route path="platform-settings/commissions" element={<CommissionManagement />} />
          <Route path="platform-settings/cma" element={<ComplianceAudit tab="cma" />} />
        </Routes>
      </div>
    </DashboardLayout>
  )
}