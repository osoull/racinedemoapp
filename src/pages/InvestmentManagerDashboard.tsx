import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTable from "@/components/investment-manager/ProjectsTable";
import InvestmentsTable from "@/components/investment-manager/InvestmentsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton } from "@/components/BackButton";

type ProjectStatus = "pending" | "approved" | "rejected" | "funding" | "completed";
type InvestmentStatus = "pending" | "confirmed" | "cancelled";

const InvestmentManagerDashboard = () => {
  const { user } = useAuth();
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<ProjectStatus>("pending");
  const [selectedInvestmentStatus, setSelectedInvestmentStatus] = useState<InvestmentStatus>("pending");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          owner: profiles(first_name, middle_name, last_name)
        `);
      if (error) throw error;
      return data;
    },
  });

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          investor: profiles(first_name, middle_name, last_name),
          project: projects(title)
        `);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 pt-20 pb-6">
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">لوحة تحكم مدير الاستثمار</h1>
          <p className="text-muted-foreground mt-1">
            {profile ? `مرحباً بك, ${profile.first_name}` : "مرحباً بك"}
          </p>
        </div>
        <UserAvatar />
      </div>
      
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">المشاريع</TabsTrigger>
          <TabsTrigger value="investments">الاستثمارات</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card className="p-4">
            <div className="mb-4">
              <select
                className="border rounded p-2"
                value={selectedProjectStatus}
                onChange={(e) => setSelectedProjectStatus(e.target.value as ProjectStatus)}
              >
                <option value="pending">قيد المراجعة</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
                <option value="funding">قيد التمويل</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>
            <ProjectsTable 
              projects={projects || []} 
              status={selectedProjectStatus}
              isLoading={projectsLoading}
            />
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="p-4">
            <div className="mb-4">
              <select
                className="border rounded p-2"
                value={selectedInvestmentStatus}
                onChange={(e) => setSelectedInvestmentStatus(e.target.value as InvestmentStatus)}
              >
                <option value="pending">قيد المراجعة</option>
                <option value="confirmed">مؤكد</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
            <InvestmentsTable 
              investments={investments || []} 
              status={selectedInvestmentStatus}
              isLoading={investmentsLoading}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentManagerDashboard;
