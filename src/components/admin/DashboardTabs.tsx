import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Briefcase, Wallet, Activity, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import UserManagement from "./UserManagement"
import ProjectManagement from "./ProjectManagement"
import CommissionManagement from "./CommissionManagement"
import ComplianceAudit from "./ComplianceAudit"
import SupportTools from "./SupportTools"
import { StatsGrid } from "@/components/dashboard/stats/StatsGrid"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"

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
    <div className="min-h-screen w-full bg-card">
      {isOverview && (
        <div className="space-y-6 p-6">
          <StatsGrid />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">نظرة عامة على المشاريع</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">المشاريع النشطة</span>
                  <span className="font-medium">{stats?.totalProjects || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">إجمالي التمويل</span>
                  <span className="font-medium">{stats?.totalFunding?.toLocaleString()} ريال</span>
                </div>
              </div>
            </Card>
            
            <ActivityFeed />
          </div>
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
              <span className="hidden sm:inline">المستخدمين</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary-50"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">المشاريع</span>
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary-50"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">الامتثال</span>
            </TabsTrigger>
            <TabsTrigger 
              value="commissions" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary-50"
            >
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">العمولات</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">
              <UserManagement />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectManagement />
            </TabsContent>
            <TabsContent value="compliance">
              <ComplianceAudit />
            </TabsContent>
            <TabsContent value="commissions">
              <CommissionManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}