import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { UserType } from "@/types/user"

interface PrivateRouteProps {
  children: React.ReactNode
  allowedTypes?: UserType[]
}

export const PrivateRoute = ({ children, allowedTypes }: PrivateRouteProps) => {
  const { user } = useAuth()

  const { data: profile, isLoading } = useQuery({
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
    return <Navigate to="/" />
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Admins have access to everything
  if (profile?.user_type === "admin") {
    return <>{children}</>
  }

  // Investment managers have access to specified routes
  if (profile?.user_type === "investment_manager" && allowedTypes?.includes("investment_manager")) {
    return <>{children}</>
  }

  // Check other user types against allowed types
  if (allowedTypes && profile?.user_type && !allowedTypes.includes(profile.user_type)) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}