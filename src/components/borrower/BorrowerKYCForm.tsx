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
import { LegalRepresentativeSection } from "./kyc/LegalRepresentativeSection"
import { KYCFormData } from "@/types/kyc"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BorrowerDashboardLayout } from "./BorrowerDashboardLayout"
import { useKycValidation } from "@/hooks/useKycValidation"

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

  const { isValid: kycValid, loading: validationLoading } = useKycValidation(kycData, user?.id || '')

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

  const requestKYCVerification = async () => {
    if (!kycValid) {
      toast({
        title: "خطأ",
        description: "يجب إكمال جميع المعلومات والمستندات المطلوبة قبل طلب التحقق",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from("borrower_kyc")
        .update({
          verification_status: 'submitted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error

      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلب التحقق من الهوية بنجاح. سيتم مراجعته من قبل الفريق المختص.",
      })
      
      loadProfile()
    } catch (error) {
      console.error("Error requesting KYC verification:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال طلب التحقق",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || validationLoading) {
    return (
      <BorrowerDashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </BorrowerDashboardLayout>
    )
  }

  return (
    <BorrowerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary-800">التحقق من الهوية</h2>
          <p className="text-muted-foreground">
            إدارة وثائق التحقق من الهوية والمعلومات المطلوبة
          </p>
        </div>

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

            {profile?.kyc_status !== 'approved' && !kycValid && (
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

        {/* Legal Representative Section */}
        <LegalRepresentativeSection kycData={kycData} setKycData={setKycData} />

        {/* Company Information */}
        <CompanyInfoSection kycData={kycData} setKycData={setKycData} />

        {/* Bank Details */}
        <BankDetailsSection kycData={kycData} setKycData={setKycData} />

        {/* Documents */}
        <DocumentUploadSection />

        {/* Request KYC Verification Button */}
        {profile?.kyc_status !== 'approved' && (
          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full"
                size="lg"
                onClick={requestKYCVerification}
                disabled={saving || !kycValid}
              >
                {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                طلب التحقق من الهوية
              </Button>
              {!kycValid && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  يجب استكمال جميع المعلومات والمستندات المطلوبة قبل طلب التحقق
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </BorrowerDashboardLayout>
  )
}
