import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"

interface BorrowerSignUpFormProps {
  onBack: () => void
  onSuccess: () => void
}

export function BorrowerSignUpForm({ onBack, onSuccess }: BorrowerSignUpFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    commercialRegister: "",
    nationalId: "",
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب"
    if (!formData.companyName) newErrors.companyName = "اسم الشركة مطلوب"
    if (!formData.commercialRegister) newErrors.commercialRegister = "السجل التجاري مطلوب"
    if (!formData.nationalId) newErrors.nationalId = "رقم الهوية مطلوب"
    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة"
    if (!formData.acceptTerms) newErrors.acceptTerms = "يجب الموافقة على الشروط والأحكام"
    
    const saudiIdRegex = /^[12]\d{9}$/
    if (formData.nationalId && !saudiIdRegex.test(formData.nationalId)) {
      newErrors.nationalId = "يجب أن يكون رقم الهوية 10 أرقام ويبدأ بـ 1 أو 2"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: "borrower",
            company_name: formData.companyName,
            commercial_register: formData.commercialRegister,
            national_id: formData.nationalId,
            first_name: "",
            last_name: "",
          }
        }
      })

      if (signUpError) throw signUpError

      if (user) {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يمكنك الآن تسجيل الدخول",
        })
        onSuccess()
      }
    } catch (error: any) {
      console.error("SignUp error:", error)
      toast({
        title: "خطأ في التسجيل",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
        <CardTitle>التسجيل كمقترض</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              dir="rtl"
            />
            <Input
              placeholder="اسم الشركة"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              error={errors.companyName}
              dir="rtl"
            />
            <Input
              placeholder="رقم السجل التجاري"
              value={formData.commercialRegister}
              onChange={(e) => setFormData(prev => ({ ...prev, commercialRegister: e.target.value }))}
              error={errors.commercialRegister}
              dir="rtl"
            />
            <Input
              placeholder="رقم هوية المدير"
              value={formData.nationalId}
              onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
              error={errors.nationalId}
              maxLength={10}
              dir="rtl"
            />
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={errors.password}
              dir="rtl"
            />
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id="terms" 
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
            />
            <Label 
              htmlFor="terms" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              أوافق على الشروط والأحكام
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-500">{errors.acceptTerms}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            تسجيل
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}