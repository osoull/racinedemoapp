import { useAuth } from "@/contexts/AuthContext"
import { Navigate } from "react-router-dom"

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function PrivateRoute({ children, allowedRoles = [] }: PrivateRouteProps) {
  const { user, userDetails } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles.length > 0 && userDetails?.user_type && !allowedRoles.includes(userDetails.user_type)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}