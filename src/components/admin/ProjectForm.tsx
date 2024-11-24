import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectDocumentUpload } from "./project/ProjectDocumentUpload";
import { ProjectClassification } from "./project/ProjectClassification";
import { ProjectInvestmentLimits } from "./project/ProjectInvestmentLimits";

const projectSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  description: z.string().min(1, "وصف المشروع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  min_investment: z.number().min(1000, "الحد الأدنى للاستثمار يجب أن يكون أكبر من 1000 ريال"),
  classification: z.enum([
    'تمويل مشاريع طرف ثاني',
    'تمويل الفواتير',
    'تمويل رأس المال العامل',
    'تمويل التوسع',
    'تمويل المشاريع العقارية'
  ], {
    required_error: "يرجى اختيار تصنيف المشروع"
  }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Tables<"projects"> | null;
  onSuccess?: () => void;
}

export const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      funding_goal: project?.funding_goal || 0,
      min_investment: 1000,
      classification: project?.classification as any || "تمويل مشاريع طرف ثاني",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const projectData = {
        title: values.title,
        description: values.description,
        funding_goal: values.funding_goal,
        min_investment: values.min_investment,
        classification: values.classification,
        owner_id: user?.id,
      };
      
      const { error } = await supabase.from("projects").insert(projectData);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء المشروع بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء المشروع",
        description: "حدث خطأ أثناء محاولة إنشاء المشروع",
        variant: "destructive",
      });
      console.error("Error creating project:", error);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const projectData = {
        title: values.title,
        description: values.description,
        funding_goal: values.funding_goal,
        min_investment: values.min_investment,
        classification: values.classification,
      };
      
      const { error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", project?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث المشروع بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث المشروع",
        description: "حدث خطأ أثناء محاولة تحديث المشروع",
        variant: "destructive",
      });
      console.error("Error updating project:", error);
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    if (project) {
      updateProjectMutation.mutate(values);
    } else {
      createProjectMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المشروع *</FormLabel>
              <FormControl>
                <Input {...field} className="text-right" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProjectClassification control={form.control} />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المشروع *</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px] text-right" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProjectInvestmentLimits control={form.control} />

        <div className="space-y-4">
          <h3 className="font-semibold">المستندات المطلوبة *</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProjectDocumentUpload
              title="عرض تقديمي للمشروع"
              description="يرجى رفع الملف بصيغة PDF"
              type="presentation"
            />

            <ProjectDocumentUpload
              title="دراسة الجدوى"
              description="يرجى رفع الملف بصيغة PDF"
              type="feasibility"
            />

            <ProjectDocumentUpload
              title="التقرير المالي"
              description="يرجى رفع الملف بصيغة PDF"
              type="financial"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {project ? "تحديث المشروع" : "إنشاء المشروع"}
        </Button>
      </form>
    </Form>
  );
};
