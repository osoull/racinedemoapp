import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { UserType } from "@/types/user";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedTypes: UserType[];
}

export const PrivateRoute = ({ children, allowedTypes }: PrivateRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 60000, // Keep in cache for 1 minute (renamed from cacheTime)
  });

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  if (!allowedTypes.includes(profile.user_type as UserType)) {
    const redirectPath = (() => {
      switch (profile.user_type) {
        case "admin":
          return "/admin/dashboard";
        case "borrower":
          return "/borrower/dashboard";
        case "basic_investor":
        case "qualified_investor":
          return "/investor/dashboard";
        default:
          return "/";
      }
    })();

    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};