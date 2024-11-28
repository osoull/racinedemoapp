import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { UserTypeSelection } from "./auth/UserTypeSelection"
import { SignUpForm } from "./auth/SignUpForm"
import { BorrowerSignUpForm } from "./auth/BorrowerSignUpForm"
import { SignInForm } from "./auth/SignInForm"
import { UserType } from "@/types/user"

type AuthStep = "selection" | "signup" | "signin" | "borrower_signup"

export function Auth() {
  const [step, setStep] = useState<AuthStep>("signin")
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (user && !isRedirecting) {
      setIsRedirecting(true)
      checkUserTypeAndRedirect()
    }
  }, [user])

  const checkUserTypeAndRedirect = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      if (!profile) throw new Error("No profile found")

      redirectBasedOnUserType(profile.user_type as UserType)
    } catch (error: any) {
      console.error("Error fetching user type:", error)
      setIsRedirecting(false)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء توجيهك للوحة التحكم",
        variant: "destructive",
      })
    }
  }

  const redirectBasedOnUserType = (userType: UserType) => {
    let path = "/"
    switch (userType) {
      case "admin":
        path = "/admin/dashboard"
        break
      case "investment_manager":
        path = "/investment-manager/dashboard"
        break
      case "borrower":
        path = "/borrower/dashboard"
        break
      case "basic_investor":
      case "qualified_investor":
        path = "/investor/dashboard"
        break
    }
    navigate(path, { replace: true })
  }

  const handleSignIn = async (email: string, password: string) => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) {
        toast({
          title: "خطأ",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      })
    } catch (error: any) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeSelect = (type: "investor" | "borrower" | "login") => {
    if (type === "login") {
      setStep("signin")
    } else if (type === "borrower") {
      setStep("borrower_signup")
    } else {
      setStep("signup")
    }
  }

  const renderAuthContent = () => {
    switch (step) {
      case "selection":
        return <UserTypeSelection onSelect={handleUserTypeSelect} />
      case "signup":
        return (
          <SignUpForm 
            onBack={() => setStep("signin")}
            onSuccess={() => setStep("signin")}
          />
        )
      case "borrower_signup":
        return (
          <BorrowerSignUpForm 
            onBack={() => setStep("signin")}
            onSuccess={() => setStep("signin")}
          />
        )
      default:
        return (
          <SignInForm 
            onSignIn={handleSignIn}
            onRegisterClick={() => setStep("selection")}
            isLoading={isLoading}
          />
        )
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center flex-col">
      <img 
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
        alt="Racine Investment" 
        className="w-64 md:w-72 lg:w-80 mb-8 object-contain dark:hidden" 
      />
      <img 
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
        alt="Racine Investment" 
        className="w-64 md:w-72 lg:w-80 mb-8 object-contain hidden dark:block" 
      />
      {renderAuthContent()}
    </div>
  )
}