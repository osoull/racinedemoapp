import { Routes, Route } from "react-router-dom"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import ProjectManagement from "@/components/admin/ProjectManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import PlatformSettings from "@/components/admin/PlatformSettings"
import { KYCManagement } from "@/components/admin/compliance/KYCManagement"
import { TransactionManagement } from "@/components/admin/transaction/TransactionManagement"
import BorrowerManagement from "@/components/admin/borrower/BorrowerManagement"
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
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
                alt="شركة رسين للاستثمار"
                className="h-8 object-contain dark:hidden" 
              />
              <img 
                src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
                alt="شركة رسين للاستثمار"
                className="h-8 object-contain hidden dark:block" 
              />
              <h2 className="text-2xl font-bold text-foreground">
                مرحباً بك {profile.first_name}
              </h2>
            </div>
          </div>
        )}

        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="borrowers" element={<BorrowerManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
          <Route path="compliance" element={<KYCManagement />} />
          <Route path="reports" element={<DashboardOverview />} />
          <Route path="settings/*" element={<PlatformSettings />} />
        </Routes>
      </div>
    </DashboardLayout>
  )
}