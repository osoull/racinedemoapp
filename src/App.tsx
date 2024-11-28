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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function App() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getUserRedirectPath = () => {
    if (!user || !profile) return '/';
    
    try {
      const userType = profile.user_type;
      console.log("Profile:", profile); // Debug log
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
            element={
              !user ? (
                <Auth />
              ) : (
                <Navigate to={getUserRedirectPath()} replace />
              )
            } 
          />

          <Route 
            path="/admin/*" 
            element={
              profile?.user_type === 'admin' ? (
                <AdminRoutes />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/borrower/*" 
            element={
              profile?.user_type === 'borrower' ? (
                <BorrowerRoutes />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/investor/*" 
            element={
              ['basic_investor', 'qualified_investor'].includes(profile?.user_type || '') ? (
                <InvestorRoutes />
              ) : (
                <Navigate to="/" replace />
              )
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