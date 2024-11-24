import { Input } from "@/components/ui/input"
import { KYCFormData } from "@/types/kyc"

interface CompanyInfoSectionProps {
  kycData: KYCFormData;
  setKycData: React.Dispatch<React.SetStateAction<KYCFormData>>;
}

export function CompanyInfoSection({ kycData, setKycData }: CompanyInfoSectionProps) {
  return (
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
          onChange={(e) => setKycData({ ...kycData, annual_revenue: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">عدد الموظفين</label>
        <Input
          type="number"
          value={kycData.number_of_employees}
          onChange={(e) => setKycData({ ...kycData, number_of_employees: Number(e.target.value) })}
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
  )
}