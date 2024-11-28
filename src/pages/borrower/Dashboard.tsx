import { BorrowerDashboardOverview } from "@/components/borrower/dashboard/BorrowerDashboardOverview"

export default function BorrowerDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">نظرة عامة</h2>
      <p className="text-muted-foreground">
        مرحباً بك في لوحة التحكم الخاصة بك
      </p>
      <BorrowerDashboardOverview />
    </div>
  )
}