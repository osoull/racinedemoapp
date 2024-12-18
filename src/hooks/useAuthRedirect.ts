import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useAuthRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const redirectBasedOnUserType = async (userId: string) => {
    setIsRedirecting(true)
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", userId)
        .single()

      if (error) throw error

      // If no profile exists, create one with default type
      if (!profiles) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              id: userId,
              user_type: "basic_investor",
              first_name: "",
              last_name: "",
            },
          ])

        if (insertError) throw insertError

        await navigate("/investor/dashboard")
        return
      }

      switch (profiles.user_type) {
        case "borrower":
          await navigate("/borrower/dashboard")
          break
        case "admin":
          await navigate("/admin")
          break
        default:
          await navigate("/investor/dashboard")
      }
    } catch (error: any) {
      console.error("Error during redirect:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء توجيهك للوحة التحكم",
        variant: "destructive",
      })
    } finally {
      setIsRedirecting(false)
    }
  }

  return { isRedirecting, redirectBasedOnUserType }
}