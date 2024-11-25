import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { SignInForm } from "./auth/SignInForm"
import { SignUpForm } from "./auth/SignUpForm"
import { BorrowerSignUpForm } from "./auth/BorrowerSignUpForm"
import { ResetPasswordForm } from "./auth/ResetPasswordForm"
import { UserTypeSelection } from "./auth/UserTypeSelection"
import { useToast } from "@/components/ui/use-toast"

type AuthStep = "selection" | "signup" | "signin" | "borrower_signup" | "reset_password";
type UserType = "investor" | "admin" | "borrower" | "investment_manager";
type SelectableUserType = Extract<UserType, "investor" | "borrower">;

export function Auth() {
  const [step, setStep] = useState<AuthStep>("signin")
  const [userType, setUserType] = useState<SelectableUserType>("investor")
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Vérifier l'état de l'authentification au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleRedirect(session.user.id)
      }
    })

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        handleRedirect(session.user.id)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleRedirect = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single()

      if (error) throw error

      switch (profile?.user_type) {
        case 'admin':
          navigate('/admin')
          break
        case 'investor':
          navigate('/investor')
          break
        case 'borrower':
          navigate('/borrower')
          break
        default:
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "نوع المستخدم غير صالح",
            variant: "destructive",
          })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      })
    }
  }

  const handleUserTypeSelect = (type: SelectableUserType | "login") => {
    if (type === "login") {
      setStep("signin")
    } else if (type === "borrower") {
      setStep("borrower_signup")
    } else {
      setUserType(type)
      setStep("signup")
    }
  }

  if (step === "selection") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <UserTypeSelection onSelect={handleUserTypeSelect} />
      </div>
    )
  }

  if (step === "signup") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center flex-col">
        <SignUpForm 
          userType={userType}
          onBack={() => setStep("signin")}
          onSuccess={() => setStep("signin")}
        />
      </div>
    )
  }

  if (step === "borrower_signup") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center flex-col">
        <BorrowerSignUpForm 
          onBack={() => setStep("signin")}
          onSuccess={() => setStep("signin")}
        />
      </div>
    )
  }

  if (step === "reset_password") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center flex-col">
        <ResetPasswordForm onBack={() => setStep("signin")} />
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center flex-col">
      <SignInForm 
        onForgotPassword={() => setStep("reset_password")}
        onSignUp={() => setStep("selection")}
      />
    </div>
  )
}