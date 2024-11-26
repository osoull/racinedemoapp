import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProjectBasicInfo } from "./ProjectBasicInfo";
import { ProjectDescription } from "./ProjectDescription";
import { ProjectInvestmentDetails } from "./ProjectInvestmentDetails";
import { ProjectDocuments } from "./ProjectDocuments";

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
  location: z.string().min(1, "موقع المشروع مطلوب"),
  summary: z.string().min(1, "ملخص المشروع مطلوب"),
  objectives: z.array(z.string()).min(1, "يجب إضافة هدف واحد على الأقل"),
  problem: z.string().min(1, "وصف المشكلة مطلوب"),
  solution: z.string().min(1, "وصف الحل مطلوب"),
  impact: z.string().min(1, "وصف الأثر المتوقع مطلوب")
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: any;
  onSubmit: (data: ProjectFormValues) => void;
}

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      funding_goal: project?.funding_goal || 0,
      min_investment: project?.min_investment || 1000,
      classification: project?.classification || "تمويل مشاريع طرف ثاني",
      location: project?.location || "",
      summary: project?.summary || "",
      objectives: project?.objectives || [""],
      problem: project?.problem || "",
      solution: project?.solution || "",
      impact: project?.impact || ""
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProjectBasicInfo control={form.control} />
            <ProjectInvestmentDetails control={form.control} />
          </div>
          <div className="space-y-6">
            <ProjectDescription control={form.control} />
            <ProjectDocuments />
          </div>
        </div>
        <div className="flex justify-end pt-6 border-t">
          <Button type="submit">
            متابعة لدفع الرسوم
          </Button>
        </div>
      </form>
    </Form>
  );
}