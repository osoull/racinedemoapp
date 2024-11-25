import { Input } from "@/components/ui/input"
import { KYCFormData } from "@/types/kyc"

interface BankDetailsSectionProps {
  kycData: KYCFormData;
  setKycData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}

export function BankDetailsSection({ kycData, setKycData }: BankDetailsSectionProps) {
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
            رقم الحساب <span className="text-red-500">*</span>
          </label>
          <Input
            value={kycData.bank_account_details.account_number}
            onChange={(e) => setKycData({
              ...kycData,
              bank_account_details: {
                ...kycData.bank_account_details,
                account_number: e.target.value
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
    </div>
  )
}