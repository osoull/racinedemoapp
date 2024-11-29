import { Navigate, Routes, Route } from "react-router-dom"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { useAuth } from "@/contexts/AuthContext"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments"
import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import InvestorDashboard from "@/pages/investor/Dashboard"

export const RoleRoutes = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <Routes>
      {/* Borrower Routes */}
      <Route
        path="/borrower/*"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <Routes>
              <Route
                path="dashboard"
                element={
                  <BorrowerDashboardLayout>
                    <BorrowerDashboardOverview />
                  </BorrowerDashboardLayout>
                }
              />
              <Route
                path="profile"
                element={
                  <BorrowerDashboardLayout>
                    <BorrowerProfile />
                  </BorrowerDashboardLayout>
                }
              />
              <Route
                path="kyc"
                element={
                  <BorrowerDashboardLayout>
                    <BorrowerKYCForm />
                  </BorrowerDashboardLayout>
                }
              />
              <Route
                path="payments"
                element={
                  <BorrowerDashboardLayout>
                    <BorrowerPayments />
                  </BorrowerDashboardLayout>
                }
              />
            </Routes>
          </PrivateRoute>
        }
      />

      {/* Investor Routes */}
      <Route
        path="/investor/*"
        element={
          <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
            <DashboardLayout sidebar={<InvestorSidebar />}>
              <Routes>
                <Route path="dashboard" element={<InvestorDashboard />} />
              </Routes>
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Default redirect based on user type */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/borrower/dashboard" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}