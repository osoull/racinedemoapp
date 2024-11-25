import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { SignInForm } from "./auth/SignInForm"
import { SignUpForm } from "./auth/SignUpForm"
import { BorrowerSignUpForm } from "./auth/BorrowerSignUpForm"
import { ResetPasswordForm } from "./auth/ResetPasswordForm"
import { UserTypeSelection } from "./auth/UserTypeSelection"

type AuthStep = "selection" | "signup" | "signin" | "borrower_signup" | "reset_password";
type UserType = "investor" | "admin" | "borrower" | "investment_manager";
type SelectableUserType = Extract<UserType, "investor" | "borrower">;

export function Auth() {
  const [step, setStep] = useState<AuthStep>("signin")
  const [userType, setUserType] = useState<SelectableUserType>("investor")
  const navigate = useNavigate()

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

  // Vérifier si l'utilisateur est déjà connecté
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      navigate("/")
    }
  })

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