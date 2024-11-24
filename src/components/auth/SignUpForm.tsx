import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SignUpFormProps {
  userType: "investor" | "borrower"
  investorType?: "basic" | "qualified"
  onBack: () => void
  onSuccess: () => void
}

export function SignUpForm({ userType, investorType = "basic", onBack, onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [selectedInvestorType, setSelectedInvestorType] = useState(investorType)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            investor_type: userType === "investor" ? selectedInvestorType : undefined
          }
        }
      })

      if (error) throw error

      if (user) {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يمكنك الآن تسجيل الدخول",
        })
        onSuccess()
      }
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
        <CardTitle>إنشاء حساب جديد</CardTitle>
        <CardDescription>
          {userType === "investor" ? "مستثمر جديد" : "صاحب مشروع"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="الاسم الأول"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              placeholder="اسم العائلة"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {userType === "investor" && (
              <Select
                value={selectedInvestorType}
                onValueChange={(value: "basic" | "qualified") => setSelectedInvestorType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="نوع المستثمر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">مستثمر أساسي</SelectItem>
                  <SelectItem value="qualified">مستثمر مؤهل</SelectItem>
                </SelectContent>
              </Select>
            )}
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