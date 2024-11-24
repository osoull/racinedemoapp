import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { UserAvatar } from "@/components/UserAvatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FileText, Users, Wallet, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { StatCard } from "@/components/dashboard/StatCard"

const InvestorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

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
  const expectedReturn = totalInvestment * 0.15

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            مرحباً {profile?.first_name}
          </h1>
          <p className="text-muted-foreground">
            هذه نظرة عامة على استثماراتك
          </p>
        </div>
        <UserAvatar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Wallet}
          title="إجمالي الاستثمارات"
          value={`${totalInvestment.toLocaleString()} ريال`}
          trend={{ value: 8.2, isPositive: true }}
          iconBgColor="bg-primary-50"
          iconColor="text-primary"
        />
        <StatCard
          icon={FileText}
          title="المشاريع النشطة"
          value={activeProjects}
          trend={{ value: 12.5, isPositive: true }}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Users}
          title="المستثمرين المشاركين"
          value={investments?.length || 0}
          trend={{ value: 15.2, isPositive: true }}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          icon={TrendingUp}
          title="العائد المتوقع"
          value={`${expectedReturn.toLocaleString()} ريال`}
          trend={{ value: 4.1, isPositive: false }}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="active">المشاريع النشطة</TabsTrigger>
          <TabsTrigger value="completed">المشاريع المكتملة</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {investments?.filter(inv => inv.project.status === 'active').map((investment) => (
            <div key={investment.investment_id} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{investment.project.title}</h3>
                  <p className="text-sm text-muted-foreground">{investment.project.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  عرض التفاصيل
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>نسبة التمويل</span>
                  <span>{Math.round((investment.project.current_funding / investment.project.funding_goal) * 100)}%</span>
                </div>
                <Progress value={(investment.project.current_funding / investment.project.funding_goal) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {investments?.filter(inv => inv.project.status === 'completed').map((investment) => (
            <div key={investment.investment_id} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{investment.project.title}</h3>
                  <p className="text-sm text-muted-foreground">{investment.project.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  تحميل التقرير
                </Button>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>العائد المحقق</span>
                <span className="text-green-600 font-semibold">
                  {(investment.amount * 0.15).toLocaleString()} ريال
                </span>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InvestorDashboard