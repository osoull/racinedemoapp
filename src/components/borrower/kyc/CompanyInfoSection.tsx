import { Input } from "@/components/ui/input"
import { KYCFormData } from "@/types/kyc"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface CompanyInfoSectionProps {
  kycData: KYCFormData;
  setKycData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}

export function CompanyInfoSection({ kycData, setKycData }: CompanyInfoSectionProps) {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("borrower_kyc")
        .upsert({
          ...kycData,
          annual_revenue: Number(kycData.annual_revenue),
          number_of_employees: Number(kycData.number_of_employees),
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast({
        title: "تم التحديث",
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
    <div className="space-y-6">
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
            اسم الممثل القانوني <span className="text-red-500">*</span>
          </label>
          <Input
            value={kycData.legal_representative_name}
            onChange={(e) => setKycData({ ...kycData, legal_representative_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            رقم هوية الممثل القانوني <span className="text-red-500">*</span>
          </label>
          <Input
            value={kycData.legal_representative_id}
            onChange={(e) => setKycData({ ...kycData, legal_representative_id: e.target.value })}
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
      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        حفظ المعلومات
      </Button>
    </div>
  )
}
