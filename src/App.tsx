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
  const { user, loading: authLoading } = useAuth();
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

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل الملف الشخصي",
          variant: "destructive",
        });
        return null;
      }
      return data;
    },
    enabled: !!user,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show loading spinner while profile is being fetched (only if user is authenticated)
  if (user && profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Navigate 
                  to={
                    profile?.user_type === 'admin' ? '/admin/dashboard' :
                    profile?.user_type === 'borrower' ? '/borrower/dashboard' :
                    profile?.user_type === 'basic_investor' || profile?.user_type === 'qualified_investor' ? '/investor/dashboard' :
                    '/'
                  } 
                  replace 
                />
              )
            } 
          />

          <Route 
            path="/admin/*" 
            element={
              !user ? <Navigate to="/" replace /> :
              profile?.user_type === 'admin' ? <AdminRoutes /> :
              <Navigate to="/" replace />
            } 
          />
          
          <Route 
            path="/borrower/*" 
            element={
              !user ? <Navigate to="/" replace /> :
              profile?.user_type === 'borrower' ? <BorrowerRoutes /> :
              <Navigate to="/" replace />
            } 
          />
          
          <Route 
            path="/investor/*" 
            element={
              !user ? <Navigate to="/" replace /> :
              ['basic_investor', 'qualified_investor'].includes(profile?.user_type || '') ? <InvestorRoutes /> :
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