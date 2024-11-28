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
import { useToast } from "@/components/ui/use-toast";

function App() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getUserRedirectPath = () => {
    try {
      const userType = user?.user_metadata?.user_type;
      console.log("User type:", userType); // Debug log
      
      switch (userType) {
        case 'admin':
          return '/admin/dashboard';
        case 'borrower':
          return '/borrower/dashboard';
        case 'basic_investor':
        case 'qualified_investor':
          return '/investor/dashboard';
        default:
          console.log("No valid user type found, redirecting to /"); // Debug log
          return '/';
      }
    } catch (error) {
      console.error("Error in getUserRedirectPath:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء توجيهك للوحة التحكم",
        variant: "destructive",
      });
      return '/';
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to={getUserRedirectPath()} replace /> : <Auth />} 
          />

          <Route 
            path="/admin/*" 
            element={
              user?.user_metadata?.user_type === 'admin' ? 
                <AdminRoutes /> : 
                <Navigate to="/" replace />
            } 
          />
          
          <Route 
            path="/borrower/*" 
            element={
              user?.user_metadata?.user_type === 'borrower' ? 
                <BorrowerRoutes /> : 
                <Navigate to="/" replace />
            } 
          />
          
          <Route 
            path="/investor/*" 
            element={
              ['basic_investor', 'qualified_investor'].includes(user?.user_metadata?.user_type || '') ? 
                <InvestorRoutes /> : 
                <Navigate to="/" replace />
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;