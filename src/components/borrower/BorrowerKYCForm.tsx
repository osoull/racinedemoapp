import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface BankAccountDetails {
  bank_name: string;
  account_number: string;
  iban: string;
}

interface KYCData {
  company_registration_date: string;
  company_registration_number: string;
  tax_identification_number: string;
  legal_representative_name: string;
  legal_representative_id: string;
  annual_revenue: string;
  number_of_employees: string;
  industry_sector: string;
  company_website: string;
  bank_account_details: BankAccountDetails;
}

export function BorrowerKYCForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [kycData, setKycData] = useState<KYCData>({
    company_registration_date: "",
    company_registration_number: "",
    tax_identification_number: "",
    legal_representative_name: "",
    legal_representative_id: "",
    annual_revenue: "",
    number_of_employees: "",
    industry_sector: "",
    company_website: "",
    bank_account_details: {
      bank_name: "",
      account_number: "",
      iban: ""
    }
  })

  useEffect(() => {
    loadKYCData()
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
          annual_revenue: data.annual_revenue?.toString() || "",
          number_of_employees: data.number_of_employees?.toString() || "",
          bank_account_details: data.bank_account_details || {
            bank_name: "",
            account_number: "",
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
          id: user?.id,
          ...kycData,
          annual_revenue: Number(kycData.annual_revenue),
          number_of_employees: Number(kycData.number_of_employees),
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
    <Card>
      <CardHeader>
        <CardTitle>معلومات التحقق من الهوية (KYC)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">تاريخ تسجيل الشركة</label>
              <Input
                type="date"
                value={kycData.company_registration_date}
                onChange={(e) => setKycData({ ...kycData, company_registration_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">رقم السجل التجاري</label>
              <Input
                value={kycData.company_registration_number}
                onChange={(e) => setKycData({ ...kycData, company_registration_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الرقم الضريبي</label>
              <Input
                value={kycData.tax_identification_number}
                onChange={(e) => setKycData({ ...kycData, tax_identification_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">اسم الممثل القانوني</label>
              <Input
                value={kycData.legal_representative_name}
                onChange={(e) => setKycData({ ...kycData, legal_representative_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">رقم هوية الممثل القانوني</label>
              <Input
                value={kycData.legal_representative_id}
                onChange={(e) => setKycData({ ...kycData, legal_representative_id: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الإيرادات السنوية</label>
              <Input
                type="number"
                value={kycData.annual_revenue}
                onChange={(e) => setKycData({ ...kycData, annual_revenue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">عدد الموظفين</label>
              <Input
                type="number"
                value={kycData.number_of_employees}
                onChange={(e) => setKycData({ ...kycData, number_of_employees: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">القطاع</label>
              <Input
                value={kycData.industry_sector}
                onChange={(e) => setKycData({ ...kycData, industry_sector: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الموقع الإلكتروني</label>
              <Input
                type="url"
                value={kycData.company_website}
                onChange={(e) => setKycData({ ...kycData, company_website: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">معلومات الحساب البنكي</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">اسم البنك</label>
                <Input
                  value={kycData.bank_account_details.bank_name}
                  onChange={(e) => setKycData({
                    ...kycData,
                    bank_account_details: {
                      ...kycData.bank_account_details,
                      bank_name: e.target.value
                    }
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">رقم الحساب</label>
                <Input
                  value={kycData.bank_account_details.account_number}
                  onChange={(e) => setKycData({
                    ...kycData,
                    bank_account_details: {
                      ...kycData.bank_account_details,
                      account_number: e.target.value
                    }
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">IBAN</label>
                <Input
                  value={kycData.bank_account_details.iban}
                  onChange={(e) => setKycData({
                    ...kycData,
                    bank_account_details: {
                      ...kycData.bank_account_details,
                      iban: e.target.value
                    }
                  })}
                />
              </div>
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
