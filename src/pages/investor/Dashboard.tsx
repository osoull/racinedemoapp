import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Wallet, Activity, FileText, Users, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"
import { FundingChart } from "@/components/dashboard/charts/FundingChart"

const InvestorDashboard = () => {
  const { user } = useAuth()

  const { data: investments } = useQuery({
    queryKey: ["investments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          project:projects(*)
        `)
        .eq("investor_id", user?.id)
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  const totalInvestment = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0
  const activeProjects = investments?.filter(inv => inv.project.status === 'active').length || 0
  const expectedReturn = totalInvestment * 0.15 // 15% expected return for demonstration

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Wallet}
            title="إجمالي الاستثمارات"
            value={`${totalInvestment.toLocaleString()} ريال`}
            trend={{ value: 8.2, isPositive: true }}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={Activity}
            title="المشاريع النشطة"
            value={activeProjects}
            trend={{ value: 12.5, isPositive: true }}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            title="العائد المتوقع"
            value={`${expectedReturn.toLocaleString()} ريال`}
            trend={{ value: 15.2, isPositive: true }}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={FileText}
            title="المشاريع المكتملة"
            value={investments?.filter(inv => inv.project.status === 'completed').length || 0}
            trend={{ value: 4.1, isPositive: true }}
            iconBgColor="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <FundingChart />
          <ActivityFeed />
        </div>

        {/* Active Investments */}
        <div className="grid gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">استثماراتي النشطة</h3>
            <div className="space-y-4">
              {investments?.filter(inv => inv.project.status === 'active')
                .map((investment) => (
                  <Card key={investment.investment_id} className="p-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{investment.project.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {investment.project.description}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{investment.amount.toLocaleString()} ريال</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(investment.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>نسبة التمويل</span>
                        <span>
                          {Math.round((investment.project.current_funding / investment.project.funding_goal) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ 
                            width: `${Math.round((investment.project.current_funding / investment.project.funding_goal) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InvestorDashboard