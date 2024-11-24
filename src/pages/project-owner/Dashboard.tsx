import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { UserAvatar } from "@/components/UserAvatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Users, Target, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { StatCard } from "@/components/dashboard/StatCard"

const ProjectOwnerDashboard = () => {
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
    <div className="container mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            مرحباً {profile?.first_name}
          </h1>
          <p className="text-muted-foreground">
            هذه نظرة عامة على مشاريعك
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/project-owner/new-project")}>
            <Plus className="h-4 w-4 ml-2" />
            مشروع جديد
          </Button>
          <UserAvatar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={TrendingUp}
          title="إجمالي التمويل"
          value={`${totalFunding.toLocaleString()} ريال`}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          icon={Users}
          title="عدد المستثمرين"
          value={totalInvestors}
          trend={{ value: 12.5, isPositive: true }}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Target}
          title="المشاريع النشطة"
          value={activeProjects}
          trend={{ value: 15.2, isPositive: true }}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          icon={FileText}
          title="نسبة النجاح"
          value="85%"
          trend={{ value: 4.1, isPositive: true }}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        {["active", "pending", "completed"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {projects?.filter(proj => proj.status === status).map((project) => (
              <div key={project.id} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/project-owner/projects/${project.id}`)}
                  >
                    عرض التفاصيل
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>نسبة التمويل</span>
                    <span>{Math.round((project.current_funding / project.funding_goal) * 100)}%</span>
                  </div>
                  <Progress value={(project.current_funding / project.funding_goal) * 100} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>عدد المستثمرين</span>
                    <span>{project.investments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default ProjectOwnerDashboard
