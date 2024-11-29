import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { CompanyInfoSection } from "./kyc/CompanyInfoSection"
import { BankDetailsSection } from "./kyc/BankDetailsSection"
import { DocumentUploadSection } from "./kyc/DocumentUploadSection"
import { KYCFormData } from "@/types/kyc"

export function BorrowerKYCForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [kycData, setKycData] = useState<KYCFormData>({
    id: user?.id || '',
    company_registration_date: "",
    company_registration_number: "",
    tax_identification_number: "",
    legal_representative_name: "",
    legal_representative_id: "",
    annual_revenue: 0,
    number_of_employees: 0,
    industry_sector: "",
    company_website: "",
    bank_account_details: {
      bank_name: "",
      account_holder_name: "",
      iban: ""
    }
  })

  useEffect(() => {
    if (user) {
      loadKYCData()
    }
  }, [user])

  const loadKYCData = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from("borrower_kyc")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error

      if (data) {
        setKycData({
          ...data,
          annual_revenue: Number(data.annual_revenue) || 0,
          number_of_employees: Number(data.number_of_employees) || 0,
          bank_account_details: data.bank_account_details as any || {
            bank_name: "",
            account_holder_name: "",
            iban: ""
          }
        })
      }
    } catch (error) {
      console.error("Error loading KYC data:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from("borrower_kyc")
        .upsert({
          ...kycData,
          annual_revenue: Number(kycData.annual_revenue),
          number_of_employees: Number(kycData.number_of_employees),
          bank_account_details: kycData.bank_account_details as any,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast({
        title: "تم التحديث",
        description: "تم تحديث البيانات بنجاح",
      })
    } catch (error) {
      console.error("Error updating KYC data:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات التحقق من الهوية (KYC)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CompanyInfoSection kycData={kycData} setKycData={setKycData} />
            <BankDetailsSection kycData={kycData} setKycData={setKycData} />
            <DocumentUploadSection />
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ المعلومات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
