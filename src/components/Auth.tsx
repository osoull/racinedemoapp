import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<string>("investor")
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (action: "signin" | "signup") => {
    try {
      if (action === "signin") {
        await signIn(email, password)
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single()

        if (profile?.user_type) {
          switch (profile.user_type) {
            case "admin":
              navigate("/admin")
              break
            case "investment_manager":
              navigate("/investment-manager")
              break
            default:
              navigate("/")
          }
        }
      } else {
        await signUp(email, password, userType)
        setIsSignUp(false)
      }
    } catch (error) {
      // Error is handled in AuthContext
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Logo" className="h-16 mx-auto mb-12" />
          <h1 className="auth-title">صكوك المالية</h1>
          <p className="auth-subtitle">
            أول شركة تقنية مالية لطرح الصكوك للشركات وتمكين المستثمرين من الاستثمار فيها
          </p>
        </div>
        
        <Card className="auth-card">
          <CardHeader>
            <CardTitle>{isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}</CardTitle>
            <CardDescription>
              {isSignUp ? "قم بإدخال بياناتك لإنشاء حساب" : "قم بتسجيل الدخول للمتابعة"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              {isSignUp && (
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investor">مستثمر</SelectItem>
                    <SelectItem value="project_owner">صاحب مشروع</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full" 
              onClick={() => handleSubmit(isSignUp ? "signup" : "signin")}
            >
              {isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              {isSignUp ? (
                <button 
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline"
                >
                  لديك حساب بالفعل؟ قم بتسجيل الدخول
                </button>
              ) : (
                <button 
                  onClick={() => setIsSignUp(true)}
                  className="text-primary hover:underline"
                >
                  ليس لديك حساب؟ قم بإنشاء حساب جديد
                </button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}