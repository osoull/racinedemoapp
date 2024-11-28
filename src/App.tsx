import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/contexts/AuthContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { ThemeProvider } from "@/components/ui/theme"
import { Routes, Route, Navigate } from "react-router-dom"
import { Auth } from "@/components/Auth"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import InvestorDashboard from "@/pages/investor/Dashboard"
import BorrowerDashboard from "@/pages/borrower/Dashboard"
import AdminDashboard from "@/pages/admin/Dashboard"
import Portfolio from "@/pages/investor/Portfolio"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import { InvestorManagement } from "@/components/admin/investors/InvestorManagement"
import { ComplianceAudit } from "@/components/admin/ComplianceAudit"
import PlatformSettings from "@/components/admin/PlatformSettings"
import { RevenueTracking } from "@/components/admin/revenue/RevenueTracking"
import FundingRequestsPage from "@/pages/admin/funding-requests"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <NotificationsProvider>
            <div className="min-h-screen bg-background font-messiri" dir="rtl">
              <Routes>
                <Route path="/" element={<Auth />} />
                
                <Route
                  path="/investor/*"
                  element={
                    <PrivateRoute allowedTypes={["investor"]}>
                      <Routes>
                        <Route path="/" element={<InvestorDashboard />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/borrower/*"
                  element={
                    <PrivateRoute allowedTypes={["borrower"]}>
                      <Routes>
                        <Route path="/" element={<BorrowerDashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute allowedTypes={["admin"]}>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/investors" element={<InvestorManagement />} />
                        <Route path="/funding-requests" element={<FundingRequestsPage />} />
                        <Route path="/compliance" element={<ComplianceAudit />} />
                        <Route path="/settings" element={<PlatformSettings />} />
                        <Route path="/revenue" element={<RevenueTracking />} />
                      </Routes>
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App