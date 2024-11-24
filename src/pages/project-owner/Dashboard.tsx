import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Users, Target, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { StatCard } from "@/components/dashboard/StatCard"
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar"

const ProjectOwnerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

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
    <DashboardLayout sidebar={<DashboardSidebar />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">لوحة تحكم مالك المشروع</h1>
          <Button onClick={() => navigate("/project-owner/new-project")}>
            <Plus className="h-4 w-4 ml-2" />
            مشروع جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          />
          <StatCard
            icon={Target}
            title="المشاريع النشطة"
            value={activeProjects}
            trend={{ value: 15.2, isPositive: true }}
          />
          <StatCard
            icon={FileText}
            title="نسبة النجاح"
            value="85%"
            trend={{ value: 4.1, isPositive: true }}
          />
        </div>

        <div className="space-y-4">
          {projects?.map((project) => (
            <Card key={project.id} className="p-6 bg-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
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
                  <span className="text-foreground">نسبة التمويل</span>
                  <span className="text-foreground">
                    {Math.round((project.current_funding / project.funding_goal) * 100)}%
                  </span>
                </div>
                <Progress value={(project.current_funding / project.funding_goal) * 100} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>عدد المستثمرين</span>
                  <span>{project.investments?.length || 0}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProjectOwnerDashboard