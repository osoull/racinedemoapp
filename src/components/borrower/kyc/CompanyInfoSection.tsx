import { Input } from "@/components/ui/input"
import { KYCFormData } from "@/types/kyc"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface CompanyInfoSectionProps {
  kycData: KYCFormData;
  setKycData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}

export function CompanyInfoSection({ kycData, setKycData }: CompanyInfoSectionProps) {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Validation des champs de la société uniquement
    if (!kycData.company_registration_date || 
        !kycData.company_registration_number || 
        !kycData.tax_identification_number || 
        !kycData.industry_sector || 
        !kycData.company_website) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع معلومات الشركة",
        variant: "destructive",
      })
      setSaving(false)
      return
    }

    try {
      const { error } = await supabase
        .from("borrower_kyc")
        .upsert({
          id: kycData.id,
          company_registration_date: kycData.company_registration_date,
          company_registration_number: kycData.company_registration_number,
          tax_identification_number: kycData.tax_identification_number,
          industry_sector: kycData.industry_sector,
          company_website: kycData.company_website,
          annual_revenue: Number(kycData.annual_revenue),
          number_of_employees: Number(kycData.number_of_employees),
        })

      if (error) throw error

      toast({
        title: "تم الحفظ",
        description: "تم حفظ معلومات الشركة بنجاح",
      })
    } catch (error) {
      console.error("Error saving company info:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المعلومات",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الشركة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              تاريخ تسجيل الشركة <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={kycData.company_registration_date}
              onChange={(e) => setKycData({ ...kycData, company_registration_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              رقم السجل التجاري <span className="text-red-500">*</span>
            </label>
            <Input
              value={kycData.company_registration_number}
              onChange={(e) => setKycData({ ...kycData, company_registration_number: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              الرقم الضريبي <span className="text-red-500">*</span>
            </label>
            <Input
              value={kycData.tax_identification_number}
              onChange={(e) => setKycData({ ...kycData, tax_identification_number: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              الإيرادات السنوية <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={kycData.annual_revenue}
              onChange={(e) => setKycData({ ...kycData, annual_revenue: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              عدد الموظفين <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={kycData.number_of_employees}
              onChange={(e) => setKycData({ ...kycData, number_of_employees: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              القطاع <span className="text-red-500">*</span>
            </label>
            <Input
              value={kycData.industry_sector}
              onChange={(e) => setKycData({ ...kycData, industry_sector: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              الموقع الإلكتروني <span className="text-red-500">*</span>
            </label>
            <Input
              type="url"
              value={kycData.company_website}
              onChange={(e) => setKycData({ ...kycData, company_website: e.target.value })}
              required
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          حفظ المعلومات
        </Button>
      </CardContent>
    </Card>
  )
}