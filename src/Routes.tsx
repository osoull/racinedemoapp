import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Auth } from "@/components/Auth"
import { AdminRoutes } from "@/components/auth/AdminRoutes"
import { BorrowerRoutes } from "@/components/auth/BorrowerRoutes"
import { InvestorRoutes } from "@/components/auth/InvestorRoutes"

export function Routes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <RouterRoutes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </RouterRoutes>
    )
  }

  const userType = user?.user_metadata?.user_type

  return (
    <RouterRoutes>
      <AdminRoutes />
      <BorrowerRoutes />
      <InvestorRoutes />

      {/* Redirection par défaut basée sur le type d'utilisateur */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              userType === "admin"
                ? "/admin/dashboard"
                : userType === "borrower"
                ? "/borrower/dashboard"
                : userType === "basic_investor" || userType === "qualified_investor"
                ? "/investor/dashboard"
                : "/auth"
            }
            replace
          />
        }
      />
      
      {/* Route catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  )
}