import { Navigate, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar";
import { InvestorSidebar } from "@/components/investor/InvestorSidebar";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

// Routes - Admin
import AdminDashboard from "@/pages/admin/Dashboard";

// Routes - Borrower
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview";
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile";
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm";
import { FundingRequestsList } from "@/components/borrower/funding/FundingRequestsList";
import { NewFundingRequest } from "@/components/borrower/funding/NewFundingRequest";
import { EditFundingRequest } from "@/components/borrower/funding/EditFundingRequest";
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments";

// Routes - Investor
import InvestorDashboard from "@/pages/investor/Dashboard";

export const RoleRoutes = () => {
  return (
    <Routes>
      {/* Routes Admin */}
      <Route path="/admin" element={
        <PrivateRoute allowedTypes={["admin"]}>
          <DashboardLayout sidebar={<AdminSidebar />}>
            <Routes>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="finance" element={<div>Finance</div>} />
              <Route path="payment-defaults" element={<div>Payment Defaults</div>} />
              <Route path="investors" element={<div>Investors</div>} />
              <Route path="investment-opportunities" element={<div>Investment Opportunities</div>} />
              <Route path="borrowers" element={<div>Borrowers</div>} />
              <Route path="funding-requests" element={<div>Funding Requests</div>} />
              <Route path="compliance" element={<div>Compliance</div>} />
              <Route path="settings" element={<div>Settings</div>} />
            </Routes>
          </DashboardLayout>
        </PrivateRoute>
      } />

      {/* Routes Emprunteur */}
      <Route path="/borrower" element={
        <PrivateRoute allowedTypes={["borrower"]}>
          <DashboardLayout sidebar={<BorrowerSidebar />}>
            <Routes>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<BorrowerDashboardOverview />} />
              <Route path="profile" element={<BorrowerProfile />} />
              <Route path="kyc" element={<BorrowerKYCForm />} />
              <Route path="funding-requests" element={<FundingRequestsList />} />
              <Route path="funding-requests/new" element={<NewFundingRequest />} />
              <Route path="funding-requests/:id/edit" element={<EditFundingRequest />} />
              <Route path="payments" element={<BorrowerPayments />} />
            </Routes>
          </DashboardLayout>
        </PrivateRoute>
      } />

      {/* Routes Investisseur */}
      <Route path="/investor" element={
        <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
          <DashboardLayout sidebar={<InvestorSidebar />}>
            <Routes>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<InvestorDashboard />} />
            </Routes>
          </DashboardLayout>
        </PrivateRoute>
      } />

      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};