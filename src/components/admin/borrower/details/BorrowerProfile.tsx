import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KycStatusLabel } from "../../KycStatusLabel"

interface BorrowerProfileProps {
  borrower: any // Type to be defined based on your data structure
}

export function BorrowerProfile({ borrower }: BorrowerProfileProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات الشركة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">اسم الشركة</label>
              <p className="mt-1">{borrower.company_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">السجل التجاري</label>
              <p className="mt-1">{borrower.commercial_register}</p>
            </div>
            <div>
              <label className="text-sm font-medium">نوع النشاط</label>
              <p className="mt-1">{borrower.business_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium">حالة KYC</label>
              <div className="mt-1">
                <KycStatusLabel status={borrower.kyc_status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>معلومات الممثل القانوني</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">الاسم الكامل</label>
              <p className="mt-1">{`${borrower.first_name} ${borrower.last_name}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <p className="mt-1">{borrower.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">رقم الهاتف</label>
              <p className="mt-1">{borrower.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>العنوان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">المدينة</label>
              <p className="mt-1">{borrower.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium">العنوان</label>
              <p className="mt-1">{borrower.business_address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}