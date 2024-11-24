import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<string>("investor")
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (action: "signin" | "signup") => {
    try {
      if (action === "signin") {
        const { error } = await signIn(email, password)
        if (error) throw error
        
        // Get the user and their profile after sign in
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error("No user found after sign in")

        // Get user type from metadata
        const userType = user.user_metadata?.user_type || user.app_metadata?.user_type
        console.log('User type after signin:', userType)

        // Redirect based on user type
        switch (userType) {
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
      } else {
        await signUp(email, password, userType)
        setIsSignUp(false)
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى تسجيل الدخول للمتابعة",
        })
      }
    } catch (error) {
      console.error("Auth error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      })
    }
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
          <CardTitle>{isSignUp ? "إنشاء حساب جديد" : "مرحباً بك"}</CardTitle>
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
                  <SelectItem value="project_owner">طالب تمويل</SelectItem>
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
  )
}