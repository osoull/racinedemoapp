import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}