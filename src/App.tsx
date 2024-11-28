import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/utils/queryClient";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { InvestorManagement } from "@/components/admin/investor/InvestorManagement";
import { BorrowerManagement } from "@/components/admin/borrower/BorrowerManagement";
import { FundingRequestsPage } from "@/components/admin/request/FundingRequestsPage";
import { ComplianceAudit } from "@/components/admin/compliance/ComplianceAudit";
import { PlatformSettings } from "@/components/admin/settings/PlatformSettings";
import { RevenueTracking } from "@/components/admin/revenue/RevenueTracking";
import { FinanceOverview } from "@/components/admin/finance/FinanceOverview";
import { TransactionManagement } from "@/components/admin/finance/TransactionManagement";
import PrivateRoute from "@/components/PrivateRoute";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/investors" element={<InvestorManagement />} />
                        <Route path="/borrowers" element={<BorrowerManagement />} />
                        <Route path="/funding-requests" element={<FundingRequestsPage />} />
                        <Route path="/compliance" element={<ComplianceAudit />} />
                        <Route path="/settings" element={<PlatformSettings />} />
                        <Route path="/revenue" element={<RevenueTracking />} />
                        <Route path="/finance/overview" element={<FinanceOverview />} />
                        <Route path="/finance/transactions" element={<TransactionManagement />} />
                      </Routes>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/investor/*"
                  element={
                    <PrivateRoute>
                      <Routes>
                        <Route path="/" element={<InvestorDashboard />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetails />} />
                      </Routes>
                    </PrivateRoute>
                  }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
