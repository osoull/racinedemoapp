import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight } from "lucide-react"

interface SignUpFormProps {
  onBack: () => void
  onSuccess: () => void
}

export function SignUpForm({ onBack, onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [nationalIdError, setNationalIdError] = useState("")
  const { toast } = useToast()

  const validateNationalId = (id: string) => {
    const saudiIdRegex = /^[12]\d{9}$/
    if (!saudiIdRegex.test(id)) {
      setNationalIdError("يجب أن يكون رقم الهوية 10 أرقام ويبدأ بـ 1 أو 2")
      return false
    }
    setNationalIdError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateNationalId(nationalId)) {
      return
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            national_id: nationalId,
            user_type: "basic_investor"
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
          مستثمر جديد
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
                رقم الهوية <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="رقم الهوية الوطنية (10 أرقام)"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                required
                dir="rtl"
                maxLength={10}
              />
              {nationalIdError && (
                <p className="text-sm text-red-500">{nationalIdError}</p>
              )}
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