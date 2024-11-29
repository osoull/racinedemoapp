import { Input } from "@/components/ui/input"
import { KYCFormData } from "@/types/kyc"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { bankDetailsToJson } from "@/types/kyc"

interface BankDetailsSectionProps {
  kycData: KYCFormData;
  setKycData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}

export function BankDetailsSection({ kycData, setKycData }: BankDetailsSectionProps) {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Validation uniquement des champs bancaires
    if (!kycData.bank_account_details.bank_name || 
        !kycData.bank_account_details.account_holder_name || 
        !kycData.bank_account_details.iban) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع معلومات الحساب البنكي",
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
          bank_account_details: bankDetailsToJson(kycData.bank_account_details),
        })

      if (error) throw error

      toast({
        title: "تم الحفظ",
        description: "تم حفظ معلومات الحساب البنكي بنجاح",
      })
    } catch (error) {
      console.error("Error saving bank details:", error)
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
    <div className="space-y-4">
      <h3 className="font-semibold">معلومات الحساب البنكي</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            اسم البنك <span className="text-red-500">*</span>
          </label>
          <Input
            value={kycData.bank_account_details.bank_name}
            onChange={(e) => setKycData({
              ...kycData,
              bank_account_details: {
                ...kycData.bank_account_details,
                bank_name: e.target.value
              }
            })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            اسم صاحب الحساب <span className="text-red-500">*</span>
          </label>
          <Input
            value={kycData.bank_account_details.account_holder_name}
            onChange={(e) => setKycData({
              ...kycData,
              bank_account_details: {
                ...kycData.bank_account_details,
                account_holder_name: e.target.value
              }
            })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            IBAN <span className="text-red-500">*</span>
          </label>
          <Input
            value={kycData.bank_account_details.iban}
            onChange={(e) => setKycData({
              ...kycData,
              bank_account_details: {
                ...kycData.bank_account_details,
                iban: e.target.value
              }
            })}
            required
          />
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={saving}>
        {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        حفظ المعلومات
      </Button>
    </div>
  )
}