import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function BusinessInfoForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    commercialRegister: "",
    businessType: "",
    businessAddress: "",
    businessDescription: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: formData.companyName,
          commercial_register: formData.commercialRegister,
          business_type: formData.businessType,
          business_address: formData.businessAddress,
          business_description: formData.businessDescription,
          profile_completed: true,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "تم بنجاح",
        description: "تم حفظ معلومات الشركة بنجاح",
      })
      
      navigate("/project-owner")
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المعلومات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>معلومات الشركة</CardTitle>
        <CardDescription>
          يرجى إكمال معلومات شركتك للمتابعة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                اسم الشركة <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="اسم الشركة"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                رقم السجل التجاري <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="رقم السجل التجاري"
                value={formData.commercialRegister}
                onChange={(e) => setFormData({ ...formData, commercialRegister: e.target.value })}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                نوع النشاط التجاري <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="نوع النشاط التجاري"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                عنوان الشركة <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="عنوان الشركة"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                وصف النشاط التجاري <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="وصف النشاط التجاري"
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                required
                dir="rtl"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ المعلومات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}