import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BorrowerManagement } from "@/components/admin/borrower/BorrowerManagement";
import { InvestorManagement } from "@/components/admin/investors/InvestorManagement";
import { FundingRequestList } from "@/components/admin/funding/FundingRequestList";
import { InvestmentOpportunities } from "@/components/admin/investors/InvestmentOpportunities";
import { TransactionManagement } from "@/components/admin/finance/TransactionManagement";
import { PaymentDefaultsManagement } from "@/components/admin/defaults/PaymentDefaultsManagement";
import { ComplianceAudit } from "@/components/admin/ComplianceAudit";
import { PlatformSettings } from "@/components/admin/PlatformSettings";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <DashboardOverview />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="borrowers"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <BorrowerManagement />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="investors"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <InvestorManagement />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="funding-requests"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <FundingRequestList />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="investment-opportunities"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <InvestmentOpportunities />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="finance"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <TransactionManagement />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="payment-defaults"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <PaymentDefaultsManagement />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="compliance"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <ComplianceAudit />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="settings"
        element={
          <PrivateRoute allowedTypes={["admin"]}>
            <DashboardLayout sidebar={<AdminSidebar />}>
              <PlatformSettings />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
