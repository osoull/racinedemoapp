import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { KYCFormData } from "@/types/kyc"
import { bankDetailsToJson } from "@/types/kyc"

interface LegalRepresentativeSectionProps {
  kycData: KYCFormData;
  setKycData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}

export function LegalRepresentativeSection({ kycData, setKycData }: LegalRepresentativeSectionProps) {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!kycData.legal_representative_name || !kycData.legal_representative_id) {
      toast({
        title: "خطأ",
        description: "جميع الحقول مطلوبة",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from("borrower_kyc")
        .upsert({
          id: kycData.id,
          company_registration_date: kycData.company_registration_date,
          company_registration_number: kycData.company_registration_number,
          tax_identification_number: kycData.tax_identification_number,
          legal_representative_name: kycData.legal_representative_name,
          legal_representative_id: kycData.legal_representative_id,
          annual_revenue: kycData.annual_revenue,
          number_of_employees: kycData.number_of_employees,
          industry_sector: kycData.industry_sector,
          company_website: kycData.company_website,
          bank_account_details: bankDetailsToJson(kycData.bank_account_details),
          verification_status: kycData.verification_status,
        })

      if (error) throw error

      toast({
        title: "تم التحديث",
        description: "تم حفظ معلومات الممثل القانوني بنجاح",
      })
    } catch (error) {
      console.error("Error saving legal representative info:", error)
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
        <CardTitle>معلومات الممثل القانوني</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                اسم الممثل القانوني <span className="text-red-500">*</span>
              </Label>
              <Input
                value={kycData.legal_representative_name}
                onChange={(e) => setKycData({
                  ...kycData,
                  legal_representative_name: e.target.value
                })}
                required
                placeholder="أدخل اسم الممثل القانوني"
              />
            </div>
            <div className="space-y-2">
              <Label>
                رقم هوية الممثل القانوني <span className="text-red-500">*</span>
              </Label>
              <Input
                value={kycData.legal_representative_id}
                onChange={(e) => setKycData({
                  ...kycData,
                  legal_representative_id: e.target.value
                })}
                required
                placeholder="أدخل رقم هوية الممثل القانوني"
              />
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            حفظ المعلومات
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}