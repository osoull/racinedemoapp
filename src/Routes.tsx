import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Auth } from "@/components/Auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { BorrowerManagement } from "@/components/admin/borrower/BorrowerManagement"
import { RegulatoryReports } from "@/components/admin/compliance/RegulatoryReports"
import { ShariaCompliance } from "@/components/admin/compliance/ShariaCompliance"
import { PlatformLicenses } from "@/components/admin/compliance/PlatformLicenses"
import { FundingManagement } from "@/components/admin/funding/FundingManagement"
import { FinanceOverview } from "@/components/admin/finance/FinanceOverview"
import { InvestorManagement } from "@/components/admin/investor/InvestorManagement"
import { KYCManagement } from "@/components/admin/kyc/KYCManagement"
import { PlatformSettings } from "@/components/admin/settings/PlatformSettings"
import Index from "@/pages/Index"

export function Routes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <RouterRoutes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </RouterRoutes>
    )
  }

  return (
    <RouterRoutes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <RouterRoutes>
                <Route path="dashboard" element={<Index />} />
                <Route path="investors" element={<InvestorManagement />} />
                <Route path="borrowers" element={<BorrowerManagement />} />
                <Route path="funding-requests" element={<FundingManagement />} />
                <Route path="finance" element={<FinanceOverview />} />
                <Route path="compliance" element={
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-primary-800">الامتثال</h2>
                      <p className="text-muted-foreground">
                        إدارة ومراقبة الامتثال التنظيمي والشرعي للمنصة
                      </p>
                    </div>
                    <ShariaCompliance />
                    <PlatformLicenses />
                    <RegulatoryReports />
                  </div>
                } />
                <Route path="kyc" element={<KYCManagement />} />
                <Route path="settings" element={<PlatformSettings />} />
              </RouterRoutes>
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Auth redirect */}
      <Route path="/auth" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </RouterRoutes>
  )
}