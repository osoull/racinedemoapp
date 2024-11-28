import { StatCard } from "@/components/dashboard/StatCard"
import { Wallet, TrendingUp, FileText, PieChart } from "lucide-react"
import { BorrowerStats } from "@/hooks/useBorrowerStats"

interface BorrowerDashboardStatsProps {
  stats: BorrowerStats
}

export function BorrowerDashboardStats({ stats }: BorrowerDashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="إجمالي التمويل المطلوب"
        value={stats?.total_requested || 0}
        icon={Wallet}
        showAsCurrency
      />
      <StatCard
        title="التمويل المستلم"
        value={stats?.total_funded || 0}
        icon={TrendingUp}
        showAsCurrency
      />
      <StatCard
        title="الطلبات النشطة"
        value={stats?.active_requests || 0}
        icon={FileText}
      />
      <StatCard
        title="نسبة النجاح"
        value={stats?.success_rate || 0}
        icon={PieChart}
        suffix="%"
      />
    </div>
  )
}