import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { UserAvatar } from "@/components/UserAvatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Eye, Download, TrendingUp } from "lucide-react"

const InvestorDashboard = () => {
  const { user } = useAuth()

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

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">إجمالي الاستثمارات</h3>
            <TrendingUp className="text-primary h-5 w-5" />
          </div>
          <p className="text-3xl font-bold">
            {investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0).toLocaleString()} ريال
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">المشاريع النشطة</h3>
            <Eye className="text-primary h-5 w-5" />
          </div>
          <p className="text-3xl font-bold">
            {investments?.filter(inv => inv.project.status === 'active').length || 0}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">العائد المتوقع</h3>
            <Download className="text-primary h-5 w-5" />
          </div>
          <p className="text-3xl font-bold">
            {(investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) * 0.15).toLocaleString()} ريال
          </p>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">المشاريع النشطة</TabsTrigger>
          <TabsTrigger value="completed">المشاريع المكتملة</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-6">
            {investments?.filter(inv => inv.project.status === 'active').map((investment) => (
              <Card key={investment.investment_id} className="p-6">
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
                  <Progress value={(investment.project.current_funding / investment.project.funding_goal) * 100} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6">
            {investments?.filter(inv => inv.project.status === 'completed').map((investment) => (
              <Card key={investment.investment_id} className="p-6">
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
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InvestorDashboard