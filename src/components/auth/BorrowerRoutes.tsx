import { Route, Routes, Navigate } from "react-router-dom"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import BorrowerDashboard from "@/pages/borrower/Dashboard"
import { FundingRequestsList } from "@/components/borrower/funding/FundingRequestsList"
import { NewFundingRequest } from "@/components/borrower/funding/NewFundingRequest"
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments"
import Settings from "@/pages/Settings"

export const BorrowerRoutes = () => {
  return (
    <Route
      path="/borrower/*"
      element={
        <PrivateRoute allowedTypes={["borrower"]}>
          <Routes>
            <Route
              path="dashboard"
              element={
                <BorrowerDashboardLayout>
                  <BorrowerDashboard />
                </BorrowerDashboardLayout>
              }
            />
            <Route
              path="funding-requests"
              element={
                <BorrowerDashboardLayout>
                  <FundingRequestsList />
                </BorrowerDashboardLayout>
              }
            />
            <Route
              path="funding-requests/new"
              element={
                <BorrowerDashboardLayout>
                  <NewFundingRequest />
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
              path="settings"
              element={
                <BorrowerDashboardLayout>
                  <Settings />
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
            <Route index element={<Navigate to="/borrower/dashboard" replace />} />
          </Routes>
        </PrivateRoute>
      }
    />
  )
}