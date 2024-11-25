import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight } from "lucide-react"

interface SignUpFormProps {
  userType: "investor" | "borrower"
  onBack: () => void
  onSuccess: () => void
}

export function SignUpForm({ userType, onBack, onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Convert userType to match the expected format in the database
      const dbUserType = userType === "investor" ? "basic_investor" : "borrower"
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: dbUserType,
            investor_type: userType === "investor" ? "basic" : undefined
          }
        }
      })

      if (error) throw error

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني وكلمة المرور",
      })
      onSuccess()
    } catch (error) {
      console.error("SignUp error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <Button 
          variant="ghost" 
          className="w-fit mb-4" 
          onClick={onBack}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          رجوع
        </Button>
        <CardTitle>إنشاء حساب جديد</CardTitle>
        <CardDescription>
          {userType === "investor" ? "مستثمر جديد" : "صاحب مشروع"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                الاسم الأول <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="الاسم الأول"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                اسم العائلة <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="اسم العائلة"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              رجوع
            </Button>
            <Button type="submit" className="flex-1">
              إنشاء حساب
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}