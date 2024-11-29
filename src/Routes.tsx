import { Routes as RouterRoutes, Route } from "react-router-dom"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { RoleRoutes } from "@/components/auth/RoleRoutes"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { BorrowerProfile } from "@/components/borrower/BorrowerProfile"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { NewFundingRequest } from "@/components/borrower/funding/NewFundingRequest"
import { FundingRequestsList } from "@/components/borrower/funding/FundingRequestsList"
import { BorrowerPayments } from "@/components/borrower/BorrowerPayments"
import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"
import { InvestorManagement } from "@/components/admin/investor/InvestorManagement"
import { KYCManagement } from "@/components/admin/kyc/KYCManagement"
import { PlatformSettings } from "@/components/admin/settings/PlatformSettings"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import Notifications from "@/pages/admin/Notifications"
import Index from "@/pages/Index"

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      
      {/* Routes communes à tous les utilisateurs */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Routes pour les emprunteurs */}
      <Route element={<RoleRoutes roles={["borrower"]} />}>
        <Route element={<BorrowerDashboardLayout />}>
          <Route path="/borrower" element={<BorrowerDashboardOverview />} />
          <Route path="/borrower/profile" element={<BorrowerProfile />} />
          <Route path="/borrower/kyc" element={<BorrowerKYCForm />} />
          <Route path="/borrower/funding/new" element={<NewFundingRequest />} />
          <Route path="/borrower/funding" element={<FundingRequestsList />} />
          <Route path="/borrower/payments" element={<BorrowerPayments />} />
        </Route>
      </Route>

      {/* Routes pour les administrateurs */}
      <Route element={<RoleRoutes roles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
              </div>
            </div>
          } />
          <Route path="admin/kyc" element={<KYCManagement />} />
          <Route path="admin/settings" element={<PlatformSettings />} />
          <Route path="admin/investors" element={<InvestorManagement />} />
        </Route>
      </Route>
    </RouterRoutes>
  )
}