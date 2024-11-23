import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import CommissionManagement from "@/components/admin/CommissionManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import ContentManagement from "@/components/admin/ContentManagement"
import SupportTools from "@/components/admin/SupportTools"
import DashboardCard from "@/components/admin/DashboardCard"
import { UserAvatar } from "@/components/UserAvatar"
import { Activity, Users, Briefcase, PieChart, FileText, HeadphonesIcon, Settings, BarChart } from "lucide-react"

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, middle_name, last_name")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const formatUserName = (profile: any) => {
    if (!profile) return '';
    return [profile.first_name, profile.middle_name, profile.last_name]
      .filter(Boolean)
      .join(' ');
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">لوحة تحكم المشرف</h1>
            <p className="text-muted-foreground">
              {profile ? `مرحباً بك, ${formatUserName(profile)}` : "مرحباً بك"}
            </p>
          </div>
          <UserAvatar />
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
  );
};

export default AdminDashboard;
