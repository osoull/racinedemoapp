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

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user?.id)
        .single()
      return data
    },
    enabled: !!user?.id
  })

  const { data: investments } = useQuery({
    queryKey: ["investments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          funding_request:funding_requests(
            title,
            funding_goal,
            current_funding,
            status
          )
        `)
        .eq("type", "investment")
        .eq("user_id", user?.id)
      
      if (error) throw error
      return data?.map(inv => ({
        ...inv,
        funding_request: inv.funding_request?.[0]
      }))
    },
    enabled: !!user?.id
  })

  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0
  const activeInvestments = investments?.filter(inv => inv.funding_request?.status === 'active').length || 0

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-4 lg:space-y-6">
        {profile?.first_name && (
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
                alt="شركة رسين للاستثمار"
                className="h-8 object-contain dark:hidden" 
              />
              <img 
                src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logoblnc.svg" 
                alt="شركة رسين للاستثمار"
                className="h-8 object-contain hidden dark:block" 
              />
              <h2 className="text-2xl font-bold text-foreground">
                مرحباً بك {profile.first_name}
              </h2>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            title="إجمالي الاستثمارات"
            value={`${totalInvestments.toLocaleString()} ريال`}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            icon={Activity}
            title="الاستثمارات النشطة"
            value={activeInvestments}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            icon={FileText}
            title="العائد المتوقع"
            value="15%"
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
