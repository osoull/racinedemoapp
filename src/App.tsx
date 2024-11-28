import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import BorrowerDashboard from "@/pages/borrower/Dashboard";
import InvestorDashboard from "@/pages/investor/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import { KYCManagement } from "@/components/admin/compliance/KYCManagement";
import { TransactionManagement } from "@/components/admin/finance/TransactionManagement";
import { PaymentDefaultsManagement } from "@/components/admin/defaults/PaymentDefaultsManagement";
import { InvestorManagement } from "@/components/admin/investors/InvestorManagement";
import { InvestmentOpportunities } from "@/components/admin/investors/InvestmentOpportunities";
import { BorrowerManagement } from "@/components/admin/borrower/BorrowerManagement";
import { FundingRequestList } from "@/components/admin/funding/FundingRequestList";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Route par défaut */}
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />

            {/* Routes Admin */}
            <Route path="/admin" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <Navigate to="/admin/dashboard" />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/dashboard" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <AdminDashboard />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/finance" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <TransactionManagement />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/payment-defaults" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <PaymentDefaultsManagement />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/investors" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <InvestorManagement />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/investment-opportunities" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <InvestmentOpportunities />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/borrowers" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <BorrowerManagement />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/funding-requests" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <FundingRequestList />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/admin/compliance" element={
              <PrivateRoute allowedTypes={["admin"]}>
                <DashboardLayout sidebar={<AdminSidebar />}>
                  <KYCManagement />
                </DashboardLayout>
              </PrivateRoute>
            } />

            {/* Routes Emprunteur */}
            <Route path="/borrower" element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <Navigate to="/borrower/dashboard" />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/borrower/dashboard" element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <BorrowerDashboard />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/borrower/funding-requests" element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <FundingRequestList />
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/borrower/payments" element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <div>Payments (à implémenter)</div>
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/borrower/profile" element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <div>Profile (à implémenter)</div>
                </DashboardLayout>
              </PrivateRoute>
            } />

            <Route path="/borrower/kyc" element={
              <PrivateRoute allowedTypes={["borrower"]}>
                <DashboardLayout sidebar={<BorrowerSidebar />}>
                  <div>KYC (à implémenter)</div>
                </DashboardLayout>
              </PrivateRoute>
            } />

            {/* Routes Investisseur */}
            <Route path="/investor/dashboard" element={
              <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
                <InvestorDashboard />
              </PrivateRoute>
            } />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;