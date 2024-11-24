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

type AuthStep = "selection" | "signup" | "signin";

export function Auth() {
  const [step, setStep] = useState<AuthStep>("selection")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"investor" | "project_owner">("investor")
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await signIn(email, password)
      if (error) throw error
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("No user found after sign in")

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      if (!profile) throw new Error("No profile found")

      switch (profile.user_type) {
        case "project_owner":
          navigate("/project-owner")
          break
        case "investor":
          navigate("/investor")
          break
        case "admin":
          navigate("/admin")
          break
        default:
          navigate("/")
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
    }
  }

  const handleUserTypeSelect = (type: "investor" | "project_owner" | "login") => {
    if (type === "login") {
      setStep("signin")
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
          onBack={() => setStep("selection")}
          onSuccess={() => setStep("signin")}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center flex-col">
      <img 
        src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F8fefc08ff6352b1f82851d81737a6460.cdn.bubble.io%2Ff1729676645537x190880546208797250%2Flogo-horizontal-full.png" 
        alt="Raseen Logo" 
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
              />
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              <button 
                onClick={() => setStep("selection")}
                className="text-primary hover:underline"
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