import { Card } from "@/components/ui/card"
import { Users, FileText, Activity, Wallet } from "lucide-react"
import { ActivityFeed } from "./activity/ActivityFeed"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  className?: string
}

function StatsCard({ title, value, subtitle, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={`p-6 transition-all hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="rounded-xl bg-primary-50 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}

export function DashboardOverview() {
  return (
    <div className="space-y-8 p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي المستخدمين"
          value="2,340"
          subtitle="+180 هذا الشهر"
          icon={Users}
        />
        <StatsCard
          title="المشاريع النشطة"
          value="45"
          subtitle="+12 هذا الشهر"
          icon={FileText}
        />
        <StatsCard
          title="الاستثمارات"
          value="89"
          subtitle="+24 هذا الشهر"
          icon={Activity}
        />
        <StatsCard
          title="إجمالي التمويل"
          value="1.2M"
          subtitle="ريال"
          icon={Wallet}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">المشاريع القادمة</h3>
          <div className="h-[300px]">
            {/* Add upcoming projects content here */}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
          <div className="h-[300px]">
            <ActivityFeed />
          </div>
        </Card>
      </div>
    </div>
  )
}