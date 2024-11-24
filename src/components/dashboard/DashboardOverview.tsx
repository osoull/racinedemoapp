import { Card } from "@/components/ui/card"
import { Users, FileText, Activity, Wallet } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: any
}

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card className="dashboard-stat-card">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-primary-50 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي المستخدمين"
          value="2,340"
          description="+180 هذا الشهر"
          icon={Users}
        />
        <StatsCard
          title="المشاريع النشطة"
          value="45"
          description="+12 هذا الشهر"
          icon={FileText}
        />
        <StatsCard
          title="الاستثمارات"
          value="89"
          description="+24 هذا الشهر"
          icon={Activity}
        />
        <StatsCard
          title="إجمالي التمويل"
          value="1.2M"
          description="ريال"
          icon={Wallet}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="dashboard-content-card col-span-4">
          <h3 className="font-semibold mb-4">النشاط الأخير</h3>
          {/* Add activity content here */}
        </Card>

        <Card className="dashboard-content-card col-span-3">
          <h3 className="font-semibold mb-4">المشاريع القادمة</h3>
          {/* Add upcoming projects content here */}
        </Card>
      </div>
    </div>
  )
}