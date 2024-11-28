import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar";
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview";
import { FundingRequestsList } from "@/components/borrower/funding/FundingRequestsList";
import { FundingRequestForm } from "@/components/borrower/funding/FundingRequestForm";
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments";
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile";
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm";
import { BorrowerSettings } from "@/components/borrower/BorrowerSettings";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

export function BorrowerRoutes() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <DashboardLayout sidebar={<BorrowerSidebar />}>
              <BorrowerDashboardOverview />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="funding-requests"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <DashboardLayout sidebar={<BorrowerSidebar />}>
              <FundingRequestsList />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="funding-requests/new"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <DashboardLayout sidebar={<BorrowerSidebar />}>
              <FundingRequestForm />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="payments"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <DashboardLayout sidebar={<BorrowerSidebar />}>
              <BorrowerPayments />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="profile"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <DashboardLayout sidebar={<BorrowerSidebar />}>
              <BorrowerProfile />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="kyc"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <DashboardLayout sidebar={<BorrowerSidebar />}>
              <BorrowerKYCForm />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="settings"
        element={
          <PrivateRoute allowedTypes={["borrower"]}>
            <DashboardLayout sidebar={<BorrowerSidebar />}>
              <BorrowerSettings />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
