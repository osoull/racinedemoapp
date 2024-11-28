import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview";
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm";
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile";
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments";
import { FundingRequestForm } from "@/components/borrower/funding/FundingRequestForm";
import { FundingRequestsList } from "@/components/borrower/funding/FundingRequestsList";
import { InvestorManagement } from "@/components/admin/investors/InvestorManagement";
import { FundingRequestList } from "@/components/admin/funding/FundingRequestList";
import { InvestmentOpportunities } from "@/components/admin/investors/InvestmentOpportunities";
import { TransactionManagement } from "@/components/admin/finance/TransactionManagement";
import { PaymentDefaultsManagement } from "@/components/admin/defaults/PaymentDefaultsManagement";
import { ComplianceAudit } from "@/components/admin/ComplianceAudit";
import { PlatformSettings } from "@/components/admin/PlatformSettings";
import { BorrowerManagement } from "@/components/admin/borrower/BorrowerManagement";

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
            path="/admin/investment-opportunities"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <InvestmentOpportunities />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/finance"
            element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <TransactionManagement />
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
          
          {/* Borrower Routes */}
          <Route
            path="/borrower/dashboard"
            element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <BorrowerDashboardOverview />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/borrower/funding-requests"
            element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <FundingRequestsList />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/borrower/funding-requests/new"
            element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <FundingRequestForm />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/borrower/payments"
            element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <BorrowerPayments />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/borrower/profile"
            element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <BorrowerProfile />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/borrower/kyc"
            element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <BorrowerKYCForm />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/borrower/settings"
            element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">إعدادات الحساب</h2>
                    {/* Settings content will be added later */}
                  </div>
                </DashboardLayout>
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