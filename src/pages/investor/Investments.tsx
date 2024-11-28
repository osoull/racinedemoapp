import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { InvestmentTracking } from "@/components/admin/finance/InvestmentTracking"

const Investments = () => {
  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الاستثمارات</h2>
          <p className="text-muted-foreground">
            إدارة استثماراتك ومتابعة أدائها
          </p>
        </div>

        <InvestmentTracking />
      </div>
    </DashboardLayout>
  )
}

export default Investments