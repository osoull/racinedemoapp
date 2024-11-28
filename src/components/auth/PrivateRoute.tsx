import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface PrivateRouteProps {
  children: React.ReactNode
  allowedTypes?: string[]
}

export const PrivateRoute = ({ children, allowedTypes }: PrivateRouteProps) => {
  const { user } = useAuth()

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  if (!user) {
    return <Navigate to="/auth" />
  }

  if (allowedTypes && profile?.user_type && !allowedTypes.includes(profile.user_type)) {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}