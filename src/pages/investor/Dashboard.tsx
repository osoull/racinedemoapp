import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Wallet, Activity, FileText, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"
import { FundingChart } from "@/components/dashboard/charts/FundingChart"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"

const InvestorDashboard = () => {
  const { user } = useAuth()

  const { data: projects } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          investments(*)
        `)
        .eq("owner_id", user?.id)
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  const totalFunding = projects?.reduce((sum, proj) => sum + (proj.current_funding || 0), 0) || 0
  const activeProjects = projects?.filter(proj => proj.status === 'active').length || 0
  const totalInvestors = projects?.reduce((sum, proj) => sum + (proj.investments?.length || 0), 0) || 0

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
            alt="Raseen Logo" 
            className="h-8 object-contain dark:hidden" 
          />
          <img 
            src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
            alt="Raseen Logo" 
            className="h-8 object-contain hidden dark:block" 
          />
          <h1 className="text-2xl font-bold text-foreground">لوحة تحكم المستثمر</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            title="إجمالي التمويل"
            value={`${totalFunding.toLocaleString()} ريال`}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            icon={Activity}
            title="عدد المستثمرين"
            value={totalInvestors}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            icon={FileText}
            title="المشاريع النشطة"
            value={activeProjects}
            trend={{ value: 15.2, isPositive: true }}
          />
          <StatCard
            icon={Wallet}
            title="نسبة النجاح"
            value="85%"
            trend={{ value: 4.1, isPositive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">تحليل الاستثمارات</h3>
            <FundingChart />
          </Card>
          <Card className="p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4 text-foreground">النشاط الأخير</h3>
            <ActivityFeed />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InvestorDashboard