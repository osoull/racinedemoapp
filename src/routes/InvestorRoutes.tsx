import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvestorSidebar } from "@/components/investor/InvestorSidebar";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

export function InvestorRoutes() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
            <DashboardLayout sidebar={<InvestorSidebar />}>
              <div>Tableau de bord investisseur</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      {/* Add other investor routes here */}
    </Routes>
  );
}
