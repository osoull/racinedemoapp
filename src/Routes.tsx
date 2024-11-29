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
import Profile from "@/pages/admin/Profile"
import Settings from "@/pages/Settings"
import Notifications from "@/pages/admin/Notifications"
import Index from "@/pages/Index"
import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import InvestorDashboard from "@/pages/investor/Dashboard"

export function Routes() {
  const { user } = useAuth()

  // Si l'utilisateur n'est pas connecté, afficher uniquement la page d'authentification
  if (!user) {
    return (
      <RouterRoutes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </RouterRoutes>
    )
  }

  // Obtenir le type d'utilisateur depuis les métadonnées
  const userType = user?.user_metadata?.user_type

  return (
    <RouterRoutes>
      {/* Routes Admin */}
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
                <Route path="platform-settings" element={<PlatformSettings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
              </RouterRoutes>
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Routes Emprunteur */}
      <Route
        path="/borrower/*"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <BorrowerDashboardLayout>
              <RouterRoutes>
                <Route path="dashboard" element={<BorrowerDashboardOverview />} />
                <Route path="profile" element={<BorrowerProfile />} />
                <Route path="kyc" element={<BorrowerKYCForm />} />
                <Route path="payments" element={<BorrowerPayments />} />
              </RouterRoutes>
            </BorrowerDashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Routes Investisseur */}
      <Route
        path="/investor/*"
        element={
          <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
            <DashboardLayout sidebar={<InvestorSidebar />}>
              <RouterRoutes>
                <Route path="dashboard" element={<InvestorDashboard />} />
              </RouterRoutes>
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Redirection après authentification */}
      <Route path="/auth" element={<Navigate to="/" replace />} />
      
      {/* Redirection par défaut basée sur le type d'utilisateur */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              userType === "admin"
                ? "/admin/dashboard"
                : userType === "borrower"
                ? "/borrower/dashboard"
                : userType === "basic_investor" || userType === "qualified_investor"
                ? "/investor/dashboard"
                : "/auth"
            }
            replace
          />
        }
      />
      
      {/* Route catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  )
}