import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { FinanceOverview } from "@/components/admin/finance/FinanceOverview";
import { TransactionManagement } from "@/components/admin/finance/TransactionManagement";
import { RevenueTracking } from "@/components/admin/revenue/RevenueTracking";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { ComplianceAudit } from "@/components/admin/ComplianceAudit";
import { PlatformSettings } from "@/components/admin/PlatformSettings";
import { BorrowerManagement } from "@/components/admin/borrower/BorrowerManagement";
import { InvestorManagement } from "@/components/admin/investors/InvestorManagement";
import { FundingRequestList } from "@/components/admin/funding/FundingRequestList";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PaymentDefaultsManagement } from "@/components/admin/defaults/PaymentDefaultsManagement";
import Investments from "@/pages/investor/Investments";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <DashboardOverview />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/finance"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <FinanceOverview />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/payment-defaults"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <PaymentDefaultsManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/investors"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <InvestorManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/borrowers"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <BorrowerManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/funding-requests"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <FundingRequestList />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/compliance"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <ComplianceAudit />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <PlatformSettings />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Investor Routes */}
          <Route
            path="/investor/opportunities"
            element={
              <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
                <Investments />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;