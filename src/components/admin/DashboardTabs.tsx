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
  <Card className={`p-6 transition-all hover:shadow-lg ${className}`}>
    <div className="flex items-center gap-4">
      <div className="rounded-xl bg-primary-50 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
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
    <div className="rounded-lg border bg-card">
      {isOverview && (
        <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
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
        <Tabs defaultValue="overview" className="w-full space-y-6">
          <TabsList className="w-full flex flex-wrap gap-2 bg-muted p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary-50"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary-50"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">المشاريع</span>
            </TabsTrigger>
            <TabsTrigger 
              value="investments" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary-50"
            >
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">الاستثمارات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="funding" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary-50"
            >
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">التمويل</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
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