import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { ThemeProvider } from "@/components/ui/theme"
import { Routes, Route } from "react-router-dom"
import { Auth } from "@/components/Auth"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import InvestorDashboard from "@/pages/investor/Dashboard"
import AdminDashboard from "@/pages/admin/Dashboard"
import BorrowerDashboard from "@/pages/borrower/Dashboard"
import InvestorsPage from "@/pages/admin/investors"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import BorrowerManagement from "@/components/admin/borrower/BorrowerManagement"
import { TransactionManagement } from "@/components/admin/transaction/TransactionManagement"
import { KYCManagement } from "@/components/admin/compliance/KYCManagement"
import PlatformSettings from "@/components/admin/PlatformSettings"
import { RevenueTracking } from "@/components/admin/revenue/RevenueTracking"
import FundingRequestsPage from "@/pages/admin/funding-requests"
import Index from "@/pages/Index"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <BrowserRouter>
          <AuthProvider>
            <NotificationsProvider>
              <div className="min-h-screen bg-background font-messiri" dir="rtl">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  
                  <Route
                    path="/investor/*"
                    element={
                      <PrivateRoute allowedRoles={["investor"]}>
                        <Routes>
                          <Route index element={<InvestorDashboard />} />
                          <Route path="reports" element={<div>Reports Page</div>} />
                          <Route path="verification" element={<div>Verification Page</div>} />
                          <Route path="support" element={<div>Support Page</div>} />
                        </Routes>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/borrower/*"
                    element={
                      <PrivateRoute allowedRoles={["borrower"]}>
                        <BorrowerDashboard />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/admin/*"
                    element={
                      <PrivateRoute allowedRoles={["admin"]}>
                        <Routes>
                          <Route index element={<AdminDashboard />} />
                          <Route path="investors" element={<InvestorsPage />} />
                          <Route path="borrowers" element={<BorrowerManagement />} />
                          <Route path="transactions" element={<TransactionManagement />} />
                          <Route path="compliance" element={<KYCManagement />} />
                          <Route path="settings/*" element={<PlatformSettings />} />
                          <Route path="revenue" element={<RevenueTracking />} />
                          <Route path="funding-requests" element={<FundingRequestsPage />} />
                        </Routes>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute allowedRoles={["investor", "admin", "borrower"]}>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute allowedRoles={["investor", "admin", "borrower"]}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                </Routes>
                <Toaster />
              </div>
            </NotificationsProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App