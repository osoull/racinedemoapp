import { Route, Routes } from "react-router-dom"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { InvestorManagement } from "@/components/admin/investor/InvestorManagement"
import { BorrowerManagement } from "@/components/admin/borrower/BorrowerManagement"
import { FundingManagement } from "@/components/admin/funding/FundingManagement"
import { FinanceOverview } from "@/components/admin/finance/FinanceOverview"
import { ShariaCompliance } from "@/components/admin/compliance/ShariaCompliance"
import { PlatformLicenses } from "@/components/admin/compliance/PlatformLicenses"
import { RegulatoryReports } from "@/components/admin/compliance/RegulatoryReports"
import { KYCManagement } from "@/components/admin/kyc/KYCManagement"
import { PlatformSettings } from "@/components/admin/settings/PlatformSettings"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import Notifications from "@/pages/admin/Notifications"

export const AdminRoutes = () => {
  return (
    <Route
      path="/admin/*"
      element={
        <PrivateRoute allowedTypes={["admin"]}>
          <DashboardLayout sidebar={<AdminSidebar />}>
            <Routes>
              <Route path="dashboard" element={<DashboardOverview />} />
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
              <Route path="platform-settings" element={<PlatformSettings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notifications" element={<Notifications />} />
            </Routes>
          </DashboardLayout>
        </PrivateRoute>
      }
    />
  )
}