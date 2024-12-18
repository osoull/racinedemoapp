import { Route, Routes } from "react-router-dom"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import InvestorDashboard from "@/pages/investor/Dashboard"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"

export const InvestorRoutes = () => {
  return (
    <Route
      path="/investor/*"
      element={
        <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
          <DashboardLayout sidebar={<InvestorSidebar />}>
            <Routes>
              <Route path="dashboard" element={<InvestorDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </DashboardLayout>
        </PrivateRoute>
      }
    />
  )
}