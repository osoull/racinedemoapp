import { useNavigate } from "react-router-dom"
import { BorrowerDashboardLayout } from "@/components/borrower/BorrowerDashboardLayout"
import { NewFundingRequest } from "@/components/borrower/funding/NewFundingRequest"

export default function NewFundingRequestPage() {
  return (
    <BorrowerDashboardLayout>
      <NewFundingRequest />
    </BorrowerDashboardLayout>
  )
}