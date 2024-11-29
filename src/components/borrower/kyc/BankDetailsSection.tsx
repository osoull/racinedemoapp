import { Input } from "@/components/ui/input"
import { KYCFormData } from "@/types/kyc"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface BankDetailsSectionProps {
  kycData: KYCFormData;
  setKycData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}

export function BankDetailsSection({ kycData, setKycData }: BankDetailsSectionProps) {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("borrower_kyc")
        .upsert({
          ...kycData,
          bank_account_details: kycData.bank_account_details,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast({
        title: "تم التحديث",
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
      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        حفظ المعلومات
      </Button>
    </div>
  )
}