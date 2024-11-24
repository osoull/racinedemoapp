import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type BorrowerSignUpFormProps = {
  onBack: () => void;
  onSuccess: () => void;
}

export function BorrowerSignUpForm({ onBack, onSuccess }: BorrowerSignUpFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [commercialRegister, setCommercialRegister] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) {
      toast({
        title: "خطأ",
        description: "يجب الموافقة على الشروط والأحكام",
        variant: "destructive",
      })
      return
    }
    try {
      await signUp(email, password, "borrower")
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يرجى تسجيل الدخول للمتابعة",
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <img 
        src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F8fefc08ff6352b1f82851d81737a6460.cdn.bubble.io%2Ff1729676645537x190880546208797250%2Flogo-horizontal-full.png" 
        alt="Raseen Logo" 
        className="w-64 md:w-72 lg:w-80 mb-8 object-contain" 
      />
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
          <CardTitle>التسجيل كمقترض</CardTitle>
          <CardDescription>
            قم بإدخال بيانات شركتك لإنشاء حساب
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="rtl"
              />
              <Input
                type="text"
                placeholder="اسم الشركة"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                dir="rtl"
              />
              <Input
                type="text"
                placeholder="رقم السجل التجاري"
                value={commercialRegister}
                onChange={(e) => setCommercialRegister(e.target.value)}
                required
                dir="rtl"
              />
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="rtl"
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <Label 
                htmlFor="terms" 
                className="text-sm text-muted-foreground cursor-pointer"
              >
                أوافق على الشروط والأحكام
              </Label>
            </div>

            <Button type="submit" className="w-full">
              تسجيل
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              <button 
                onClick={onBack}
                className="text-primary hover:underline"
              >
                لديك حساب؟ سجل دخول
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
