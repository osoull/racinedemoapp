import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { UserAvatar } from "@/components/UserAvatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Users, Target } from "lucide-react"
import { useNavigate } from "react-router-dom"

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

  return (
    <div className="container mx-auto px-4 py-8">
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
            <Plus className="h-4 w-4 mr-2" />
            مشروع جديد
          </Button>
          <UserAvatar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">إجمالي التمويل</h3>
            <TrendingUp className="text-primary h-5 w-5" />
          </div>
          <p className="text-3xl font-bold">
            {projects?.reduce((sum, proj) => sum + (proj.current_funding || 0), 0).toLocaleString()} ريال
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">عدد المستثمرين</h3>
            <Users className="text-primary h-5 w-5" />
          </div>
          <p className="text-3xl font-bold">
            {projects?.reduce((sum, proj) => sum + (proj.investments?.length || 0), 0)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">المشاريع النشطة</h3>
            <Target className="text-primary h-5 w-5" />
          </div>
          <p className="text-3xl font-bold">
            {projects?.filter(proj => proj.status === 'active').length || 0}
          </p>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">المشاريع النشطة</TabsTrigger>
          <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
          <TabsTrigger value="completed">المشاريع المكتملة</TabsTrigger>
        </TabsList>

        {["active", "pending", "completed"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-6">
              {projects?.filter(proj => proj.status === status).map((project) => (
                <Card key={project.id} className="p-6">
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
                    <Progress value={(project.current_funding / project.funding_goal) * 100} />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>عدد المستثمرين</span>
                      <span>{project.investments?.length || 0}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default ProjectOwnerDashboard