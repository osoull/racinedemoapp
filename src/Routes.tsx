import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Auth } from "@/components/Auth"

export function Routes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <RouterRoutes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </RouterRoutes>
    )
  }

  return (
    <RouterRoutes>
      <Route path="/auth" element={<Navigate to="/investor/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/investor/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/investor/dashboard" replace />} />
    </RouterRoutes>
  )
}