import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function PrivateRoute({ children, allowedRoles = [] }: PrivateRouteProps) {
  const { user, profile } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles.length > 0 && profile?.user_type && !allowedRoles.includes(profile.user_type)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}