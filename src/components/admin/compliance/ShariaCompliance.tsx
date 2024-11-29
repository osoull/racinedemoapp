import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, FileCheck2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Project = {
  id: string;
  title: string;
  status: string;
  reviewer?: string;
  review_date?: string;
  notes?: string;
};

type ShariaComplianceProps = {
  projects: Project[];
};

export const ShariaCompliance = ({ projects: initialProjects }: ShariaComplianceProps) => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["sharia-compliance-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          id,
          title,
          status,
          metadata->reviewer,
          metadata->review_date,
          metadata->sharia_notes
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "under_review":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "under_review":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>المراجعة الشرعية للمشاريع</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <FileCheck2 className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0 rtl:space-x-reverse"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium leading-none">{project.title}</h4>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(project.status)}
                      >
                        {project.status === "approved"
                          ? "معتمد"
                          : project.status === "rejected"
                          ? "مرفوض"
                          : project.status === "under_review"
                          ? "قيد المراجعة"
                          : "معلق"}
                      </Badge>
                    </div>
                    {project.reviewer && (
                      <p className="text-sm text-muted-foreground">
                        المراجع: {project.reviewer}
                      </p>
                    )}
                    {project.review_date && (
                      <p className="text-sm text-muted-foreground">
                        تاريخ المراجعة: {new Date(project.review_date).toLocaleDateString('ar-SA')}
                      </p>
                    )}
                    {project.notes && (
                      <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded-md">
                        {project.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <Button variant="ghost" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};