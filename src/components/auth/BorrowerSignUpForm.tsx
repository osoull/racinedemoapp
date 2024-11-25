import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: "borrower",
            company_name: companyName,
            commercial_register: commercialRegister
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
        src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo-horizontal-full.svg" 
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
                  اسم الشركة <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="اسم الشركة"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  رقم السجل التجاري <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="رقم السجل التجاري"
                  value={commercialRegister}
                  onChange={(e) => setCommercialRegister(e.target.value)}
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
                أوافق على الشروط والأحكام <span className="text-red-500">*</span>
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