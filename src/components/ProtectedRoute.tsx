import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: string;
}

export const ProtectedRoute = ({ children, userType }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (userType && user.user_metadata?.user_type !== userType) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};