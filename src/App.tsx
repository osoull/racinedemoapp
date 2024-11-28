import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { BorrowerRoutes } from "@/routes/BorrowerRoutes";
import { InvestorRoutes } from "@/routes/InvestorRoutes";
import { Loader2 } from "lucide-react";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getUserRedirectPath = () => {
    const userType = user?.user_metadata?.user_type;
    switch (userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'borrower':
        return '/borrower/dashboard';
      case 'basic_investor':
      case 'qualified_investor':
        return '/investor/dashboard';
      default:
        return '/';
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public authentication route */}
          <Route 
            path="/" 
            element={user ? <Navigate to={getUserRedirectPath()} replace /> : <Auth />} 
          />

          {/* Protected role-based routes */}
          <AdminRoutes />
          <BorrowerRoutes />
          <InvestorRoutes />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;