import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ProjectsTable from "@/components/investment-manager/ProjectsTable";
import InvestmentsTable from "@/components/investment-manager/InvestmentsTable";

const InvestmentManagerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
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

    if (profile?.user_type !== "investment_manager") {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["manager-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          owner: profiles(full_name)
        `);

      if (error) throw error;
      return data;
    },
  });

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ["manager-investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          investor: profiles(full_name),
          project: projects(title)
        `);

      if (error) throw error;
      return data;
    },
  });

  const updateProjectStatus = async (projectId: string, status: string) => {
    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("project_id", projectId);

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة المشروع",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة المشروع بنجاح",
      });
    }
  };

  const updateInvestmentStatus = async (investmentId: string, status: string) => {
    const { error } = await supabase
      .from("investments")
      .update({ status })
      .eq("investment_id", investmentId);

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الاستثمار",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الاستثمار بنجاح",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم مدير الاستثمار</h1>
      
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">المشاريع</TabsTrigger>
          <TabsTrigger value="investments">الاستثمارات</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>إدارة المشاريع</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectsTable 
                projects={projects || []}
                onUpdateStatus={updateProjectStatus}
                isLoading={projectsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الاستثمارات</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestmentsTable 
                investments={investments || []}
                onUpdateStatus={updateInvestmentStatus}
                isLoading={investmentsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentManagerDashboard;