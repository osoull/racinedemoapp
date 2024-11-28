import { Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvestorSidebar } from "@/components/investor/InvestorSidebar";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

export function InvestorRoutes() {
  return (
    <>
      <Route
        path="/investor/dashboard"
        element={
          <PrivateRoute allowedTypes={["basic_investor", "qualified_investor"]}>
            <DashboardLayout sidebar={<InvestorSidebar />}>
              {/* Add your investor dashboard component here */}
              <div>Tableau de bord investisseur</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      {/* Add other investor routes here */}
    </>
  );
}