import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvestorSidebar } from "@/components/investor/InvestorSidebar";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/feeCalculations";

export default function ProjectDetailsPage() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["funding-request", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          *,
          owner:profiles(first_name, last_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout sidebar={<InvestorSidebar />}>
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout sidebar={<InvestorSidebar />}>
        <div>المشروع غير موجود</div>
      </DashboardLayout>
    );
  }

  const progress = (project.current_funding / project.funding_goal) * 100;

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
            <p className="text-muted-foreground">
              {project.owner.first_name} {project.owner.last_name}
            </p>
          </div>
          <Badge
            variant={
              project.status === "active"
                ? "default"
                : project.status === "completed"
                ? "success"
                : "secondary"
            }
          >
            {project.status === "active"
              ? "نشط"
              : project.status === "completed"
              ? "مكتمل"
              : "مغلق"}
          </Badge>
        </div>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-6">
            {project.description}
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>الهدف: {formatCurrency(project.funding_goal)}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex justify-between text-sm">
              <span>التمويل الحالي</span>
              <span>{formatCurrency(project.current_funding)}</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}