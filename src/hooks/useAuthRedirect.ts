import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export function useAuthRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const navigate = useNavigate()

  const redirectBasedOnUserType = async (userId: string) => {
    setIsRedirecting(true)
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", userId)
        .single()

      if (profile) {
        switch (profile.user_type) {
          case "admin":
            navigate("/admin/dashboard")
            break
          case "borrower":
            navigate("/borrower/dashboard")
            break
          case "basic_investor":
          case "qualified_investor":
            navigate("/investor/dashboard")
            break
          default:
            navigate("/auth")
        }
      }
    } catch (error) {
      console.error("Error redirecting:", error)
      navigate("/auth")
    } finally {
      setIsRedirecting(false)
    }
  }

  return { isRedirecting, redirectBasedOnUserType }
}