import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { StatCard } from "@/components/dashboard/StatCard"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"
import { FundingChart } from "@/components/dashboard/charts/FundingChart"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { Card } from "@/components/ui/card"
import { Wallet, Activity, FileText, TrendingUp } from "lucide-react"

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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "صباح الخير"
    if (hour < 17) return "مساء الخير"
    return "مساء النور"
  }

  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0
  const activeInvestments = investments?.filter(inv => inv.funding_request?.status === 'active').length || 0

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg">
          <p className="text-xl text-primary-800 font-medium">
            {getGreeting()}, {profile?.first_name}! 👋
          </p>
          <p className="text-muted-foreground mt-1">
            نتمنى لك يوماً موفقاً ومليئاً بالإنجازات
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
          <p className="text-muted-foreground">
            نظرة عامة على محفظتك الاستثمارية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            title="إجمالي الاستثمارات"
            value={totalInvestments}
            trend={8.2}
            showAsCurrency
          />
          <StatCard
            icon={Activity}
            title="الاستثمارات النشطة"
            value={activeInvestments}
            trend={12.5}
          />
          <StatCard
            icon={FileText}
            title="العائد المتوقع"
            value={15}
            trend={15.2}
          />
          <StatCard
            icon={Wallet}
            title="نسبة النجاح"
            value={85}
            trend={4.1}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">تحليل الاستثمارات</h3>
            <FundingChart />
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
            <ActivityFeed />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InvestorDashboard