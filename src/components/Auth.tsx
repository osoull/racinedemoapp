import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { UserTypeSelection } from "./auth/UserTypeSelection"
import { SignUpForm } from "./auth/SignUpForm"
import { BorrowerSignUpForm } from "./auth/BorrowerSignUpForm"
import { Loader2 } from "lucide-react"

type AuthStep = "selection" | "signup" | "signin" | "borrower_signup";
type UserType = "investor" | "admin" | "borrower" | "investment_manager";
type SelectableUserType = Extract<UserType, "investor" | "borrower">;

export function Auth() {
  const [step, setStep] = useState<AuthStep>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<SelectableUserType>("investor")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) throw signInError

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("No user found")

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      if (!profile) throw new Error("No profile found")

      // Redirection basée sur le type d'utilisateur
      switch (profile.user_type) {
        case "investor":
          navigate("/investor")
          break
        case "borrower":
          navigate("/borrower")
          break
        case "admin":
          navigate("/admin")
          break
        case "investment_manager":
          navigate("/investment-manager")
          break
        default:
          throw new Error("Invalid user type")
      }

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
    } finally {
      setIsLoading(false)
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

  return (
    <div className="flex min-h-[80vh] items-center justify-center flex-col">
      <img 
        src="/lovable-uploads/7b06f9d7-31bb-4323-a3bd-354a51415973.png"
        alt="Racine Investment" 
        className="w-64 md:w-72 lg:w-80 mb-8 object-contain" 
      />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>مرحباً بك</CardTitle>
          <CardDescription>
            قم بتسجيل الدخول للمتابعة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-[#4338CA] hover:bg-[#3730A3]" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              <button 
                onClick={() => setStep("selection")}
                className="text-[#4338CA] hover:underline"
                type="button"
                disabled={isLoading}
              >
                ليس لديك حساب؟ قم بإنشاء حساب جديد
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}