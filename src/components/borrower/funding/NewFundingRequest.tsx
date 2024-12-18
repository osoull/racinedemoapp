import { useNavigate } from "react-router-dom"
import { FundingRequestForm } from "./FundingRequestForm"

export function NewFundingRequest() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">طلب تمويل جديد</h2>
        <p className="text-muted-foreground">
          يرجى تعبئة جميع المعلومات المطلوبة لتقديم طلب التمويل
        </p>
      </div>

      <FundingRequestForm 
        onSuccess={() => navigate("/borrower/funding-requests")}
        onCancel={() => navigate("/borrower/funding-requests")}
      />
    </div>
  )
}