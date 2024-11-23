import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

type ProjectStatus = "pending" | "approved" | "rejected" | "funding" | "completed";
type InvestmentStatus = "pending" | "confirmed" | "cancelled";

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

  const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
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

  const updateInvestmentStatus = async (investmentId: string, status: InvestmentStatus) => {
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
              {projectsLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان المشروع</TableHead>
                      <TableHead>صاحب المشروع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects?.map((project) => (
                      <TableRow key={project.project_id}>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>{project.owner?.full_name}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => updateProjectStatus(project.project_id, "approved")}
                              disabled={project.status === "approved"}
                            >
                              موافقة
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateProjectStatus(project.project_id, "rejected")}
                              disabled={project.status === "rejected"}
                            >
                              رفض
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الاستثمارات</CardTitle>
            </CardHeader>
            <CardContent>
              {investmentsLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستثمر</TableHead>
                      <TableHead>المشروع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments?.map((investment) => (
                      <TableRow key={investment.investment_id}>
                        <TableCell>{investment.investor?.full_name}</TableCell>
                        <TableCell>{investment.project?.title}</TableCell>
                        <TableCell>{investment.amount}</TableCell>
                        <TableCell>{investment.status}</TableCell>
                        <TableCell>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => updateInvestmentStatus(investment.investment_id, "confirmed")}
                              disabled={investment.status === "confirmed"}
                            >
                              تأكيد
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateInvestmentStatus(investment.investment_id, "cancelled")}
                              disabled={investment.status === "cancelled"}
                            >
                              إلغاء
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentManagerDashboard;