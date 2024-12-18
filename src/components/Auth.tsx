import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { SignInForm } from "./auth/SignInForm"
import { SignUpForm } from "./auth/SignUpForm"
import { BorrowerSignUpForm } from "./auth/BorrowerSignUpForm"
import { UserTypeSelection } from "./auth/UserTypeSelection"
import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Loader2 } from "lucide-react"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

export function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in")
  const [userType, setUserType] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const { isRedirecting, redirectBasedOnUserType } = useAuthRedirect()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      redirectBasedOnUserType(user.id)
    }
  }, [user])

  const handleSignIn = async (email: string, password: string) => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

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

      if (data.user) {
        setUser(data.user)
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        })
      }
    } catch (error: any) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
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
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-[400px]">
        <CardContent className="pt-6">
          <Tabs value={view} onValueChange={(v) => setView(v as "sign_in" | "sign_up")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign_in">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="sign_up">حساب جديد</TabsTrigger>
            </TabsList>
            <TabsContent value="sign_in">
              <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="sign_up">
              {step === 1 ? (
                <UserTypeSelection
                  onSelect={(type) => {
                    setUserType(type)
                    setStep(2)
                  }}
                />
              ) : (
                userType === "borrower" ? (
                  <BorrowerSignUpForm onBack={() => setStep(1)} />
                ) : (
                  <SignUpForm onBack={() => setStep(1)} />
                )
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}