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
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedTypes={["admin"]}>
                  <DashboardLayout sidebar={<AdminSidebar />}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="finance" element={<TransactionManagement />} />
                      <Route path="payment-defaults" element={<PaymentDefaultsManagement />} />
                      <Route path="investors" element={<InvestorManagement />} />
                      <Route path="investment-opportunities" element={<InvestmentOpportunities />} />
                      <Route path="borrowers" element={<BorrowerManagement />} />
                      <Route path="funding-requests" element={<FundingRequestList />} />
                      <Route path="compliance" element={<KYCManagement />} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Routes Emprunteur */}
            <Route
              path="/borrower/*"
              element={
                <PrivateRoute allowedTypes={["borrower"]}>
                  <DashboardLayout sidebar={<BorrowerSidebar />}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/borrower/dashboard" />} />
                      <Route path="dashboard" element={<BorrowerDashboard />} />
                      <Route path="funding-requests" element={<FundingRequestList />} />
                      <Route path="payments" element={<div>Payments (à implémenter)</div>} />
                      <Route path="profile" element={<div>Profile (à implémenter)</div>} />
                      <Route path="kyc" element={<div>KYC (à implémenter)</div>} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Routes Investisseur */}
            <Route
              path="/investor/*"
              element={
                <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/investor/dashboard" />} />
                    <Route path="dashboard" element={<InvestorDashboard />} />
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;