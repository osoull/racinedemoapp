import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { FinanceOverview } from "@/components/admin/finance/FinanceOverview";
import { TransactionManagement } from "@/components/admin/finance/TransactionManagement";
import { RevenueTracking } from "@/components/admin/revenue/RevenueTracking";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/admin/finance"
            element={
              <PrivateRoute>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <FinanceOverview />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/finance/transactions"
            element={
              <PrivateRoute>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <TransactionManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/finance/revenue"
            element={
              <PrivateRoute>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <RevenueTracking />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;