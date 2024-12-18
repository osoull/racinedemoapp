import { KYCStatsCard } from "./KYCStatsCard"

interface KYCStatsGridProps {
  data: any[] | undefined
  isLoading: boolean
}

export function KYCStatsGrid({ data, isLoading }: KYCStatsGridProps) {
  const totalRequests = data?.length || 0
  const investorRequests = data?.filter(r => r.user_type === "basic_investor" || r.user_type === "qualified_investor").length || 0
  const borrowerRequests = data?.filter(r => r.user_type === "borrower").length || 0
  const underReviewRequests = data?.filter(r => r.kyc_status === "under_review").length || 0

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <KYCStatsCard
        title="إجمالي الطلبات"
        value={totalRequests}
        isLoading={isLoading}
      />
      <KYCStatsCard
        title="المستثمرون"
        value={investorRequests}
        isLoading={isLoading}
      />
      <KYCStatsCard
        title="المقترضون"
        value={borrowerRequests}
        isLoading={isLoading}
      />
      <KYCStatsCard
        title="قيد المراجعة"
        value={underReviewRequests}
        isLoading={isLoading}
      />
    </div>
  )
}