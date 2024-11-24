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
  <Card className={`p-4 sm:p-6 transition-all hover:shadow-md ${className}`}>
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="rounded-full bg-primary/10 p-2 sm:p-3">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-500">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6">
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
      
      <div className="p-3 sm:p-4 lg:p-6">
        <Tabs defaultValue="overview" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-muted p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary-50">
              <Users className="h-4 w-4 mr-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary-50">
              <Briefcase className="h-4 w-4 mr-2" />
              المشاريع
            </TabsTrigger>
            <TabsTrigger value="investments" className="data-[state=active]:bg-primary-50">
              <Activity className="h-4 w-4 mr-2" />
              الاستثمارات
            </TabsTrigger>
            <TabsTrigger value="funding" className="data-[state=active]:bg-primary-50">
              <Wallet className="h-4 w-4 mr-2" />
              التمويل
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            {currentPath === "/admin" && <UserManagement />}
            {currentPath === "/admin/users" && <UserManagement />}
            {currentPath === "/admin/projects" && <ProjectManagement />}
            {currentPath === "/admin/commissions" && <CommissionManagement />}
            {currentPath === "/admin/compliance" && <ComplianceAudit />}
            {currentPath === "/admin/support" && <SupportTools />}
          </div>
        </Tabs>
      </div>
    </div>
  )
}