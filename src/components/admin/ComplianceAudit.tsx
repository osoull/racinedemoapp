import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileCheck2, 
  Scale, 
  Building2, 
  AlertCircle,
  FileText,
  Users
} from "lucide-react";

const ComplianceAudit = () => {
  const { data: projects } = useQuery({
    queryKey: ["projects-compliance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_documents (*)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users-compliance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          kyc_documents (*)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-6 w-6" />
          الامتثال والتدقيق
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sharia" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-auto gap-4">
            <TabsTrigger value="sharia" className="data-[state=active]:bg-primary/10">
              <FileCheck2 className="h-4 w-4 ml-2" />
              الامتثال الشرعي
            </TabsTrigger>
            <TabsTrigger value="cma" className="data-[state=active]:bg-primary/10">
              <Building2 className="h-4 w-4 ml-2" />
              هيئة السوق المالية
            </TabsTrigger>
            <TabsTrigger value="kyc" className="data-[state=active]:bg-primary/10">
              <Users className="h-4 w-4 ml-2" />
              التحقق من العملاء
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary/10">
              <FileText className="h-4 w-4 ml-2" />
              التقارير الدورية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sharia">
            <Card>
              <CardHeader>
                <CardTitle>الامتثال الشرعي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">المراجعة الشرعية للمشاريع</h3>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      {projects?.map((project) => (
                        <div key={project.id} className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <p className="text-sm text-muted-foreground">
                              حالة المراجعة: {project.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                            </p>
                          </div>
                          {project.status !== 'approved' && (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </section>

                  <section className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">تقارير المراقب الشرعي</h3>
                    <div className="grid gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="font-medium">التقرير الشهري - شعبان 1445</p>
                          <p className="text-sm text-muted-foreground">تاريخ الإصدار: 15/08/1445</p>
                        </CardContent>
                      </Card>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cma">
            <Card>
              <CardHeader>
                <CardTitle>متطلبات هيئة السوق المالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">تراخيص منصة التمويل الجماعي</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">ترخيص نشاط التمويل الجماعي</p>
                          <p className="text-sm text-muted-foreground">صالح حتى: 30/12/1445</p>
                        </div>
                        <FileCheck2 className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </section>

                  <section className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">التقارير الرقابية</h3>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium">تقرير الربع الأول 1445</p>
                          <p className="text-sm text-muted-foreground">تم الرفع بتاريخ: 01/04/1445</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>التحقق من هوية العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">طلبات التحقق الجديدة</h3>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      {users?.map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              حالة التحقق: {user.kyc_status === 'approved' ? 'مكتمل' : 'قيد المراجعة'}
                            </p>
                          </div>
                          {user.kyc_status === 'pending' && (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>التقارير الدورية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">تقارير الامتثال</h3>
                    <div className="grid gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">تقرير مكافحة غسل الأموال</p>
                              <p className="text-sm text-muted-foreground">الربع الأول 1445</p>
                            </div>
                            <FileText className="h-5 w-5" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">تقرير المخاطر التشغيلية</p>
                              <p className="text-sm text-muted-foreground">الربع الأول 1445</p>
                            </div>
                            <FileText className="h-5 w-5" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComplianceAudit;