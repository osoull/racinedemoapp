import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserManagement from "@/components/admin/UserManagement";
import ProjectManagement from "@/components/admin/ProjectManagement";
import CommissionManagement from "@/components/admin/CommissionManagement";
import ComplianceAudit from "@/components/admin/ComplianceAudit";
import ContentManagement from "@/components/admin/ContentManagement";
import SupportTools from "@/components/admin/SupportTools";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Users, Briefcase, PieChart, FileText, HeadphonesIcon } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (profile?.user_type !== "admin") {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">لوحة تحكم المشرف</h1>
          <p className="text-muted-foreground">مرحباً بك في لوحة التحكم الإدارية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
                  <p className="text-sm text-muted-foreground">إدارة حسابات المستخدمين والصلاحيات</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 hover:bg-secondary/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Briefcase className="h-8 w-8 text-secondary" />
                <div>
                  <h3 className="text-lg font-semibold">إدارة المشاريع</h3>
                  <p className="text-sm text-muted-foreground">مراقبة وإدارة المشاريع النشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 hover:bg-accent/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Activity className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="text-lg font-semibold">النشاط</h3>
                  <p className="text-sm text-muted-foreground">متابعة نشاط المنصة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto gap-4 bg-muted p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-background flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>المستخدمين</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-background flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>المشاريع</span>
            </TabsTrigger>
            <TabsTrigger value="commissions" className="data-[state=active]:bg-background flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>العمولات</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-background flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>الامتثال</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-background flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>المحتوى</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-background flex items-center gap-2">
              <HeadphonesIcon className="h-4 w-4" />
              <span>الدعم</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-card rounded-lg border p-6">
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
  );
};

export default AdminDashboard;