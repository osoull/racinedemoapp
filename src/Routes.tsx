import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Auth } from "@/components/Auth"
import Index from "@/pages/Index"

export function Routes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <RouterRoutes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    )
  }

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
            <RouterRoutes>
              <Route index element={<BorrowerDashboard />} />
              <Route path="dashboard" element={<BorrowerDashboard />} />
              <Route path="funding-requests" element={<FundingRequestsList />} />
              <Route path="funding-requests/new" element={<NewFundingRequestPage />} />
              <Route path="profile" element={<BorrowerProfile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="kyc" element={<BorrowerKYCForm />} />
              <Route path="payments" element={<BorrowerPayments />} />
            </RouterRoutes>
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
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
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