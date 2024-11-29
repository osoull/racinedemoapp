import { Navigate, Routes, Route } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { useAuth } from "@/contexts/AuthContext"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments"
import InvestorDashboard from "@/pages/investor/Dashboard"

export const RoleRoutes = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <Routes>
      {/* Borrower Routes */}
      <Route path="/borrower/*" element={
        <PrivateRoute allowedTypes={["borrower"]}>
          <Routes>
            <Route path="dashboard" element={
              <DashboardLayout sidebar={<BorrowerSidebar />}>
                <BorrowerDashboardOverview />
              </DashboardLayout>
            } />
            <Route path="profile" element={
              <DashboardLayout sidebar={<BorrowerSidebar />}>
                <BorrowerProfile />
              </DashboardLayout>
            } />
            <Route path="kyc" element={
              <DashboardLayout sidebar={<BorrowerSidebar />}>
                <BorrowerKYCForm />
              </DashboardLayout>
            } />
            <Route path="payments" element={
              <DashboardLayout sidebar={<BorrowerSidebar />}>
                <BorrowerPayments />
              </DashboardLayout>
            } />
          </Routes>
        </PrivateRoute>
      } />

      {/* Investor Routes */}
      <Route path="/investor" element={
        <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
          <DashboardLayout sidebar={<InvestorSidebar />}>
            <InvestorDashboard />
          </DashboardLayout>
        </PrivateRoute>
      } />

      {/* Default redirect based on user type */}
      <Route path="/" element={
        user?.user_metadata?.user_type === "borrower" ? 
          <Navigate to="/borrower/dashboard" replace /> :
          <Navigate to="/investor" replace />
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}