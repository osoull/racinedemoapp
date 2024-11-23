import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<string>("investor")
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (action: "signin" | "signup") => {
    try {
      if (action === "signin") {
        await signIn(email, password)
        
        // Fetch user profile to get user type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single()

        // Redirect based on user type from profile
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
      }
    } catch (error) {
      // Error is handled in AuthContext
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center flex-col">
      <img src="/logo.svg" alt="Logo" className="h-20 mb-8" />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>مرحباً بك</CardTitle>
          <CardDescription>تسجيل الدخول أو إنشاء حساب جديد</CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
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
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSubmit("signin")}>
                تسجيل الدخول
              </Button>
            </CardFooter>
          </TabsContent>
          <TabsContent value="signup">
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
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investor">مستثمر</SelectItem>
                    <SelectItem value="project_owner">صاحب مشروع</SelectItem>
                    <SelectItem value="admin">مشرف</SelectItem>
                    <SelectItem value="investment_manager">مدير استثمار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSubmit("signup")}>
                إنشاء حساب
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}