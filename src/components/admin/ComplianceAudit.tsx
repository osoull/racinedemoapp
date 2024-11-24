import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileCheck2, 
  Scale, 
  Building2,
  Users,
  FileText
} from "lucide-react";
import { ShariaCompliance } from "./compliance/ShariaCompliance";
import { CmaCompliance } from "./compliance/CmaCompliance";
import { KycCompliance } from "./compliance/KycCompliance";
import { ComplianceReports } from "./compliance/ComplianceReports";

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

  const formatUserName = (user: any) => {
    if (!user) return 'غير معروف';
    return [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(' ') || 'غير معروف';
  };

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
            <ShariaCompliance projects={projects || []} />
          </TabsContent>

          <TabsContent value="cma">
            <CmaCompliance />
          </TabsContent>

          <TabsContent value="kyc">
            <KycCompliance users={users || []} formatUserName={formatUserName} />
          </TabsContent>

          <TabsContent value="reports">
            <ComplianceReports />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComplianceAudit;