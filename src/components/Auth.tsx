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
import { Loader2 } from "lucide-react"

type AuthStep = "selection" | "signup" | "signin" | "borrower_signup";

export function Auth() {
  const [step, setStep] = useState<AuthStep>("signin")
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      checkUserTypeAndRedirect(user.id)
    }
  }, [user])

  const checkUserTypeAndRedirect = async (userId: string) => {
    try {
      setIsRedirecting(true)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      if (!profile) {
        console.error("No profile found");
        throw new Error("No profile found");
      }

      console.log("Profile found:", profile); // Debug log
      const userType = profile.user_type as UserType
      redirectBasedOnUserType(userType)
    } catch (error) {
      console.error("Error in checkUserTypeAndRedirect:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء توجيهك للوحة التحكم",
        variant: "destructive",
      })
      setIsRedirecting(false)
    }
  }

  const redirectBasedOnUserType = (userType: UserType) => {
    console.log("Redirecting based on user type:", userType); // Debug log
    switch (userType) {
      case "borrower":
        navigate("/borrower/dashboard")
        break
      case "basic_investor":
      case "qualified_investor":
        navigate("/investor/dashboard")
        break
      case "admin":
        navigate("/admin/dashboard")
        break
      default:
        navigate("/")
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) throw error
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      })
    } catch (error) {
      console.error("Auth error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      })
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

  if (isRedirecting) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
      {step === "selection" && <UserTypeSelection onSelect={handleUserTypeSelect} />}
      {step === "signup" && (
        <SignUpForm 
          onBack={() => setStep("signin")}
          onSuccess={() => setStep("signin")}
        />
      )}
      {step === "borrower_signup" && (
        <BorrowerSignUpForm 
          onBack={() => setStep("signin")}
          onSuccess={() => setStep("signin")}
        />
      )}
      {step === "signin" && (
        <SignInForm 
          onSignIn={handleSignIn}
          onRegisterClick={() => setStep("selection")}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}