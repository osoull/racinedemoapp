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
import PlatformSettings from "@/components/admin/PlatformSettings";

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
          {/* Public route - Authentication */}
          <Route path="/" element={<Auth />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <FinanceOverview />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Finance Management */}
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
            path="/admin/finance/transactions"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <TransactionManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/finance/revenue"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <RevenueTracking />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Compliance */}
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

          {/* Settings */}
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

          {/* Fallback route - Redirects to authentication */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;