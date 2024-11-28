import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

interface PrivateRouteProps {
  children: React.ReactNode
  allowedTypes?: string[]
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

  // Les administrateurs ont accès à tout
  if (profile?.user_type === "admin") {
    return <>{children}</>
  }

  // Les managers d'investissement ont accès aux routes spécifiées
  if (profile?.user_type === "investment_manager" && allowedTypes?.includes("investment_manager")) {
    return <>{children}</>
  }

  // Vérification des autres types d'utilisateurs
  if (allowedTypes && profile?.user_type && !allowedTypes.includes(profile.user_type)) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}