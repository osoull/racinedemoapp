import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { BorrowerRoutes } from "@/routes/BorrowerRoutes";
import { InvestorRoutes } from "@/routes/InvestorRoutes";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Route publique pour l'authentification */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate 
                  to={
                    user.user_metadata?.user_type === 'admin'
                      ? '/admin/dashboard'
                      : user.user_metadata?.user_type === 'borrower'
                      ? '/borrower/dashboard'
                      : '/investor/dashboard'
                  } 
                  replace 
                />
              ) : (
                <Auth />
              )
            } 
          />

          {/* Routes protégées par rôle */}
          <AdminRoutes />
          <BorrowerRoutes />
          <InvestorRoutes />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;