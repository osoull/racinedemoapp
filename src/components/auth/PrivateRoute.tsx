import { Navigate } from "react-router-dom";
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
  });

  if (!user) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/" />;
  }

  // Vérifier si le type d'utilisateur est autorisé
  if (!allowedTypes.includes(profile.user_type as UserType)) {
    // Rediriger vers la page appropriée en fonction du type d'utilisateur
    switch (profile.user_type) {
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      case "borrower":
        return <Navigate to="/borrower/dashboard" />;
      case "basic_investor":
      case "qualified_investor":
        return <Navigate to="/investor/dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};