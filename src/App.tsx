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

function App() {
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

          {/* Fallback route - Redirects to authentication */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;