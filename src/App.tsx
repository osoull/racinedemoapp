import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Auth } from "@/components/Auth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar";
import { InvestorSidebar } from "@/components/investor/InvestorSidebar";

// Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import BorrowerDashboard from "@/pages/borrower/Dashboard";
import InvestorDashboard from "@/pages/investor/Dashboard";
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile";
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm";
import { FundingRequestsList } from "@/components/borrower/funding/FundingRequestsList";
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments";
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview";
import { NewFundingRequest } from "@/components/borrower/funding/NewFundingRequest";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Page d'accueil - Authentification */}
            <Route path="/" element={<Auth />} />

            {/* Routes Admin */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedTypes={["admin"]}>
                  <DashboardLayout sidebar={<AdminSidebar />}>
                    <Routes>
                      <Route index element={<Navigate to="dashboard" />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
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
                      <Route index element={<Navigate to="dashboard" />} />
                      <Route path="dashboard" element={<BorrowerDashboardOverview />} />
                      <Route path="profile" element={<BorrowerProfile />} />
                      <Route path="kyc" element={<BorrowerKYCForm />} />
                      <Route path="funding-requests" element={<FundingRequestsList />} />
                      <Route path="funding-requests/new" element={<NewFundingRequest />} />
                      <Route path="payments" element={<BorrowerPayments />} />
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
                  <DashboardLayout sidebar={<InvestorSidebar />}>
                    <Routes>
                      <Route index element={<Navigate to="dashboard" />} />
                      <Route path="dashboard" element={<InvestorDashboard />} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;