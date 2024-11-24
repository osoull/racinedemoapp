import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Briefcase, Wallet, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import UserManagement from "./UserManagement"
import ProjectManagement from "./ProjectManagement"
import CommissionManagement from "./CommissionManagement"
import ComplianceAudit from "./ComplianceAudit"
import SupportTools from "./SupportTools"

interface StatCardProps {
  icon: any
  title: string
  value: string | number
  className?: string
}

const StatCard = ({ icon: Icon, title, value, className }: StatCardProps) => (
  <Card className={`p-6 ${className}`}>
    <div className="flex items-center gap-4">
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </Card>
)

interface DashboardTabsProps {
  stats?: {
    totalUsers: number
    totalProjects: number
    totalInvestments: number
    totalFunding: number
  }
  currentPath: string
}

export const DashboardTabs = ({ stats, currentPath }: DashboardTabsProps) => {
  const isOverview = currentPath === "/admin"

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {isOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <StatCard
            icon={Users}
            title="إجمالي المستخدمين"
            value={stats?.totalUsers || 0}
          />
          <StatCard
            icon={Briefcase}
            title="المشاريع النشطة"
            value={stats?.totalProjects || 0}
          />
          <StatCard
            icon={Activity}
            title="الاستثمارات"
            value={stats?.totalInvestments || 0}
          />
          <StatCard
            icon={Wallet}
            title="إجمالي التمويل"
            value={`${stats?.totalFunding.toLocaleString()} ريال`}
          />
        </div>
      )}
      
      <div className="p-6">
        {currentPath === "/admin" && <UserManagement />}
        {currentPath === "/admin/users" && <UserManagement />}
        {currentPath === "/admin/projects" && <ProjectManagement />}
        {currentPath === "/admin/commissions" && <CommissionManagement />}
        {currentPath === "/admin/compliance" && <ComplianceAudit />}
        {currentPath === "/admin/support" && <SupportTools />}
      </div>
    </div>
  )
}