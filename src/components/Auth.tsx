import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { UserTypeSelection } from "./auth/UserTypeSelection"
import { SignUpForm } from "./auth/SignUpForm"
import { BorrowerSignUpForm } from "./auth/BorrowerSignUpForm"
import { SignInForm } from "./auth/SignInForm"
import { Loader2 } from "lucide-react"

type AuthStep = "selection" | "signup" | "signin" | "borrower_signup"

export function Auth() {
  const [step, setStep] = useState<AuthStep>("signin")
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const redirectBasedOnUserType = async () => {
      setIsRedirecting(true)
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
          throw error
        }

        if (!profile) {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على الملف الشخصي",
            variant: "destructive",
          })
          setIsRedirecting(false)
          return
        }

        // Redirection basée sur le type d'utilisateur
        switch (profile.user_type) {
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

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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