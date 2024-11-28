import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, To, NavigateOptions } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorMessage } from "@/components/ui/error-message";
import { useEffect, useRef } from "react";
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

// Navigation throttling component
const NavigationThrottler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastNavigationTime = useRef(Date.now());

  useEffect(() => {
    const originalNavigate = navigate;
    const throttleTime = 1000; // 1 second throttle

    (navigate as any).original = originalNavigate;
    (navigate as any).throttled = (to: To, options?: NavigateOptions) => {
      const now = Date.now();
      if (now - lastNavigationTime.current >= throttleTime) {
        lastNavigationTime.current = now;
        return originalNavigate(to, options);
      }
    };
  }, [navigate]);

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NavigationThrottler>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Navigate to="/admin/dashboard" />} />

              {/* Routes Emprunteur */}
              <Route
                path="/borrower/dashboard"
                element={
                  <PrivateRoute allowedTypes={["borrower"]}>
                    <BorrowerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/borrower/funding-requests"
                element={
                  <PrivateRoute allowedTypes={["borrower"]}>
                    <FundingRequestList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/borrower/payments"
                element={
                  <PrivateRoute allowedTypes={["borrower"]}>
                    <div>Payments (à implémenter)</div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/borrower/profile"
                element={
                  <PrivateRoute allowedTypes={["borrower"]}>
                    <div>Profile (à implémenter)</div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/borrower/kyc"
                element={
                  <PrivateRoute allowedTypes={["borrower"]}>
                    <div>KYC (à implémenter)</div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/borrower/settings"
                element={
                  <PrivateRoute allowedTypes={["borrower"]}>
                    <div>Settings (à implémenter)</div>
                  </PrivateRoute>
                }
              />

              {/* Routes Investisseur */}
              <Route
                path="/investor/dashboard"
                element={
                  <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
                    <InvestorDashboard />
                  </PrivateRoute>
                }
              />

              {/* Routes Admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/finance"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <TransactionManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/payment-defaults"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <PaymentDefaultsManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/investors"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <InvestorManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/investment-opportunities"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <InvestmentOpportunities />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/borrowers"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <BorrowerManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/funding-requests"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <FundingRequestList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/compliance"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <KYCManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <PrivateRoute allowedTypes={["admin"]}>
                    <div>Settings (à implémenter)</div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </NavigationThrottler>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;