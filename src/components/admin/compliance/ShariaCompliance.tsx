import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, FileCheck2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type Project = {
  id: string;
  title: string;
  status: string;
  sharia_review_status: string;
  sharia_reviewer_id?: string;
  sharia_review_date?: string;
  sharia_notes?: string;
  description: string;
  fund_usage_plan: any;
  reviewer?: {
    first_name: string;
    last_name: string;
  } | null;
};

export const ShariaCompliance = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState<"approved" | "rejected" | "under_review">("under_review");

  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ["sharia-compliance-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          id,
          title,
          status,
          description,
          fund_usage_plan,
          sharia_review_status,
          sharia_reviewer_id,
          sharia_review_date,
          sharia_notes,
          reviewer:profiles!funding_requests_sharia_reviewer_id_fkey (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("خطأ في تحميل المشاريع");
        throw error;
      }

      return (data || []) as Project[];
    },
  });

  const handleReviewSubmit = async () => {
    if (!selectedProject || !user) return;

    const { error } = await supabase
      .from("funding_requests")
      .update({
        sharia_review_status: reviewStatus,
        sharia_reviewer_id: user.id,
        sharia_review_date: new Date().toISOString(),
        sharia_notes: reviewNotes
      })
      .eq("id", selectedProject.id);

    if (error) {
      toast.error("خطأ في حفظ المراجعة");
      return;
    }

    toast.success("تم حفظ المراجعة بنجاح");
    setSelectedProject(null);
    setReviewNotes("");
    refetch();
  };

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "معتمد";
      case "rejected":
        return "مرفوض";
      case "under_review":
        return "قيد المراجعة";
      default:
        return "معلق";
    }
  };

  return (
    <>
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
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    لا توجد مشاريع للمراجعة
                  </div>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-start justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0 rtl:space-x-reverse"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium leading-none">
                            {project.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(project.sharia_review_status)}
                          >
                            {getStatusText(project.sharia_review_status)}
                          </Badge>
                        </div>
                        {project.reviewer && (
                          <p className="text-sm text-muted-foreground">
                            المراجع: {project.reviewer.first_name}{" "}
                            {project.reviewer.last_name}
                          </p>
                        )}
                        {project.sharia_review_date && (
                          <p className="text-sm text-muted-foreground">
                            تاريخ المراجعة:{" "}
                            {new Date(project.sharia_review_date).toLocaleDateString(
                              "ar-SA"
                            )}
                          </p>
                        )}
                        {project.sharia_notes && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded-md">
                            {project.sharia_notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(project.sharia_review_status)}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setReviewNotes(project.sharia_notes || "");
                            setReviewStatus(project.sharia_review_status as any || "under_review");
                          }}
                        >
                          مراجعة
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مراجعة المشروع: {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              مراجعة المشروع وفقاً للضوابط الشرعية
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <h3 className="font-medium">وصف المشروع</h3>
              <p className="text-sm text-muted-foreground">
                {selectedProject?.description}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">خطة استخدام التمويل</h3>
              <div className="text-sm text-muted-foreground">
                {selectedProject?.fund_usage_plan && (
                  <pre className="bg-muted p-2 rounded-md">
                    {JSON.stringify(selectedProject.fund_usage_plan, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">ملاحظات المراجعة الشرعية</h3>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="أدخل ملاحظات المراجعة الشرعية هنا..."
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">قرار المراجعة</h3>
              <div className="flex gap-2">
                <Button
                  variant={reviewStatus === "approved" ? "default" : "outline"}
                  onClick={() => setReviewStatus("approved")}
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                  اعتماد
                </Button>
                <Button
                  variant={reviewStatus === "rejected" ? "default" : "outline"}
                  onClick={() => setReviewStatus("rejected")}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 ml-2" />
                  رفض
                </Button>
                <Button
                  variant={reviewStatus === "under_review" ? "default" : "outline"}
                  onClick={() => setReviewStatus("under_review")}
                  className="flex-1"
                >
                  <AlertCircle className="h-4 w-4 ml-2" />
                  قيد المراجعة
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProject(null)}>
              إلغاء
            </Button>
            <Button onClick={handleReviewSubmit}>
              حفظ المراجعة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};