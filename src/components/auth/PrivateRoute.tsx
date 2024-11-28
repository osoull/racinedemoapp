import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

interface PrivateRouteProps {
  children: React.ReactNode
  allowedTypes?: string[]
}

export const PrivateRoute = ({ children, allowedTypes }: PrivateRouteProps) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth" />
  }

  if (allowedTypes && !allowedTypes.includes(user.user_type)) {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}