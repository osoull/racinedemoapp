import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { SignInForm } from "./auth/SignInForm"
import { SignUpForm } from "./auth/SignUpForm"
import { UserTypeSelection } from "./auth/UserTypeSelection"
import { BorrowerSignUpForm } from "./auth/BorrowerSignUpForm"
import { BusinessInfoForm } from "./auth/BusinessInfoForm"
import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Loader2 } from "lucide-react"

export function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in")
  const [userType, setUserType] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { toast } = useToast()

  const redirectBasedOnUserType = async () => {
    setIsRedirecting(true)
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user?.id)
        .single()

      if (error) throw error

      // If no profile exists, create one with default type
      if (!profiles) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user?.id,
              email: user?.email,
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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }
    checkSession()
  }, [])

  useEffect(() => {
    if (!user) return
    redirectBasedOnUserType()
  }, [user, navigate, toast])

  const handleSignIn = async (email: string, password: string) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setUser(data.user)
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (email: string, password: string) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      setUser(data.user)
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBusinessInfo = async (businessInfo: any) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update(businessInfo)
        .eq("id", user?.id)

      if (error) throw error

      await navigate("/borrower/dashboard")
    } catch (error: any) {
      toast({
        title: "خطأ في حفظ المعلومات",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    switch (step) {
      case 1:
        return <UserTypeSelection onSelect={setUserType} />
      case 2:
        return userType === "borrower" ? (
          <BorrowerSignUpForm onSubmit={handleSignUp} />
        ) : (
          <BusinessInfoForm onSubmit={handleBusinessInfo} />
        )
      default:
        return null
    }
  }

  if (isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <Tabs value={view} onValueChange={(v) => setView(v as "sign_in" | "sign_up")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign_in">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="sign_up">إنشاء حساب</TabsTrigger>
            </TabsList>
            <TabsContent value="sign_in" className="mt-4">
              <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="sign_up" className="mt-4">
              {renderContent()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
