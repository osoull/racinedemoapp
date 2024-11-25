import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tables } from "@/integrations/supabase/types";
import { ProjectClassification } from "./ProjectClassification";
import { ProjectDocumentUpload } from "./ProjectDocumentUpload";
import { ProjectInvestmentLimits } from "./ProjectInvestmentLimits";
import { ProjectBasicInfo } from "./ProjectBasicInfo";

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

interface ProjectDetailsProps {
  project?: Tables<"projects"> | null;
  onSubmit: (data: ProjectFormValues) => void;
}

export const ProjectDetails = ({ project, onSubmit }: ProjectDetailsProps) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <ProjectBasicInfo control={form.control} />
        <ProjectClassification control={form.control} />
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
          متابعة لدفع الرسوم
        </Button>
      </form>
    </Form>
  );
};