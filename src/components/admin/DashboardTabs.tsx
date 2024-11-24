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
    <div className="min-h-screen w-full bg-background">
      {isOverview && (
        <div className="space-y-8 p-8">
          <StatsGrid />
          
          <div className="grid gap-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">المهام النشطة</h3>
                <Button variant="outline" size="sm">
                  فترة التقرير
                </Button>
              </div>
              <div className="h-[400px]">
                <ActivityFeed />
              </div>
            </Card>
          </div>
        </div>
      )}
      
      <div className="p-8">
        <Tabs defaultValue="overview" className="w-full space-y-8">
          <TabsList className="w-full flex flex-wrap gap-2 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-background"
            >
              <Users className="h-4 w-4 mr-2" />
              <span>المستخدمين</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-background"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              <span>المشاريع</span>
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-background"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span>الامتثال</span>
            </TabsTrigger>
            <TabsTrigger 
              value="commissions" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-background"
            >
              <Wallet className="h-4 w-4 mr-2" />
              <span>العمولات</span>
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </div>
  )
}