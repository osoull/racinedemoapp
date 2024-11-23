import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import CommissionManagement from "@/components/admin/CommissionManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import ContentManagement from "@/components/admin/ContentManagement"
import SupportTools from "@/components/admin/SupportTools"
import DashboardCard from "@/components/admin/DashboardCard"
import { Activity, Users, Briefcase, PieChart, FileText, HeadphonesIcon, Settings, BarChart } from "lucide-react"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate("/")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (profile?.user_type !== "admin") {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
        variant: "destructive",
      })
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-right">
          <h1 className="text-4xl font-bold text-primary mb-2">لوحة تحكم المشرف</h1>
          <p className="text-muted-foreground">مرحباً بك في لوحة التحكم الإدارية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={Users}
            title="إدارة المستخدمين"
            description="إدارة حسابات المستخدمين والصلاحيات"
            className="bg-primary/5 hover:bg-primary/10"
          />
          <DashboardCard
            icon={Briefcase}
            title="إدارة المشاريع"
            description="مراقبة وإدارة المشاريع النشطة"
            className="bg-secondary/5 hover:bg-secondary/10"
          />
          <DashboardCard
            icon={BarChart}
            title="الإحصائيات"
            description="تحليل أداء المنصة والمشاريع"
            className="bg-accent/5 hover:bg-accent/10"
          />
          <DashboardCard
            icon={Settings}
            title="الإعدادات"
            description="تكوين وضبط إعدادات المنصة"
            className="bg-muted hover:bg-muted/80"
          />
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm">
          <Tabs defaultValue="users" dir="rtl">
            <TabsList className="flex flex-wrap justify-start gap-2 p-4 bg-muted/50">
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <Users className="h-4 w-4" />
                <span>المستخدمين</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <Briefcase className="h-4 w-4" />
                <span>المشاريع</span>
              </TabsTrigger>
              <TabsTrigger 
                value="commissions"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <PieChart className="h-4 w-4" />
                <span>العمولات</span>
              </TabsTrigger>
              <TabsTrigger 
                value="compliance"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <FileText className="h-4 w-4" />
                <span>الامتثال</span>
              </TabsTrigger>
              <TabsTrigger 
                value="content"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <Activity className="h-4 w-4" />
                <span>المحتوى</span>
              </TabsTrigger>
              <TabsTrigger 
                value="support"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <HeadphonesIcon className="h-4 w-4" />
                <span>الدعم</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="users" className="mt-0">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="projects" className="mt-0">
                <ProjectManagement />
              </TabsContent>
              
              <TabsContent value="commissions" className="mt-0">
                <CommissionManagement />
              </TabsContent>
              
              <TabsContent value="compliance" className="mt-0">
                <ComplianceAudit />
              </TabsContent>
              
              <TabsContent value="content" className="mt-0">
                <ContentManagement />
              </TabsContent>
              
              <TabsContent value="support" className="mt-0">
                <SupportTools />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard