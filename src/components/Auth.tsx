import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
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
  const [year] = useState(new Date().getFullYear())
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const redirectBasedOnUserType = async () => {
      setIsRedirecting(true)
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single()

        if (error) throw error

        // If no profile exists, create one with default type
        if (!profiles) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                email: user.email,
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
            await navigate("/admin/dashboard")
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
        if (error.message === "Invalid login credentials") {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
            variant: "destructive",
          })
        } else {
          toast({
            title: "خطأ",
            description: error.message,
            variant: "destructive",
          })
        }
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
    <div className="flex min-h-screen items-center justify-center flex-col relative">
      <img 
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
        alt="Racine Investment" 
        className="w-64 md:w-72 lg:w-80 mb-8 object-contain" 
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
      <p className="text-primary/80 font-medium text-base text-center absolute bottom-4">
        جميع الحقوق محفوظة لشركة رسين للأستثمار© {year}
      </p>
    </div>
  )
}