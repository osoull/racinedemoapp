import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { CompanyInfoSection } from "./kyc/CompanyInfoSection"
import { BankDetailsSection } from "./kyc/BankDetailsSection"
import { DocumentUploadSection } from "./kyc/DocumentUploadSection"
import { KYCFormData } from "@/types/kyc"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BorrowerKYCForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
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
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, borrower_kyc (*)")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

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
      
      loadProfile()
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
      {/* KYC Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>حالة التحقق من الهوية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>الحالة الحالية</span>
            <Badge
              variant={profile?.kyc_status === 'approved' ? 'default' : 'secondary'}
              className={profile?.kyc_status === 'approved' ? 'bg-green-500' : ''}
            >
              {profile?.kyc_status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
            </Badge>
          </div>

          {profile?.kyc_status !== 'approved' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                يجب استكمال جميع المتطلبات التالية للحصول على الاعتماد:
                <ul className="mt-2 list-disc list-inside">
                  {!profile?.profile_completed && (
                    <li>استكمال معلومات الملف الشخصي</li>
                  )}
                  {!kycData.legal_representative_name && (
                    <li>إضافة معلومات الممثل القانوني</li>
                  )}
                  <li>تحميل واعتماد جميع المستندات المطلوبة</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Legal Representative Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الممثل القانوني</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>اسم الممثل القانوني</Label>
                <Input
                  value={kycData.legal_representative_name}
                  onChange={(e) => setKycData({
                    ...kycData,
                    legal_representative_name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>رقم هوية الممثل القانوني</Label>
                <Input
                  value={kycData.legal_representative_id}
                  onChange={(e) => setKycData({
                    ...kycData,
                    legal_representative_id: e.target.value
                  })}
                  required
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

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الشركة</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyInfoSection kycData={kycData} setKycData={setKycData} />
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الحساب البنكي</CardTitle>
        </CardHeader>
        <CardContent>
          <BankDetailsSection kycData={kycData} setKycData={setKycData} />
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>المستندات المطلوبة</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploadSection />
        </CardContent>
      </Card>
    </div>
  )
}