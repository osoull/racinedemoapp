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
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const redirectBasedOnUserType = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single()

        if (!profile) {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على الملف الشخصي",
            variant: "destructive",
          })
          return
        }

        const path = profile.user_type === "admin" ? "/admin" :
                    profile.user_type === "borrower" ? "/borrower/dashboard" :
                    "/investor/dashboard"
                    
        navigate(path, { replace: true })
      } catch (error) {
        console.error("Error fetching user type:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء توجيهك للوحة التحكم",
          variant: "destructive",
        })
      }
    }

    redirectBasedOnUserType()
  }, [user, navigate, toast])

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
      {step === "selection" ? (
        <UserTypeSelection onSelect={handleUserTypeSelect} />
      ) : step === "signup" ? (
        <SignUpForm 
          onBack={() => setStep("signin")}
          onSuccess={() => setStep("signin")}
        />
      ) : step === "borrower_signup" ? (
        <BorrowerSignUpForm 
          onBack={() => setStep("signin")}
          onSuccess={() => setStep("signin")}
        />
      ) : (
        <SignInForm 
          onSignIn={handleSignIn}
          onRegisterClick={() => setStep("selection")}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}