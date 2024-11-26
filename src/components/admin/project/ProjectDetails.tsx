import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tables } from "@/integrations/supabase/types";
import { ProjectInvestmentLimits } from "./ProjectInvestmentLimits";
import { ProjectDocumentUpload } from "./ProjectDocumentUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

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
      min_investment: project?.min_investment || 1000,
      classification: project?.classification as any || "تمويل مشاريع طرف ثاني",
      location: "",
      summary: "",
      objectives: [""],
      problem: "",
      solution: "",
      impact: ""
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <div className="space-y-4">
          <h3 className="font-semibold">معلومات عامة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان المشروع *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تصنيف المشروع *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر تصنيف المشروع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="تمويل مشاريع طرف ثاني">تمويل مشاريع طرف ثاني</SelectItem>
                      <SelectItem value="تمويل الفواتير">تمويل الفواتير</SelectItem>
                      <SelectItem value="تمويل رأس المال العامل">تمويل رأس المال العامل</SelectItem>
                      <SelectItem value="تمويل التوسع">تمويل التوسع</SelectItem>
                      <SelectItem value="تمويل المشاريع العقارية">تمويل المشاريع العقارية</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موقع المشروع *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">وصف المشروع</h3>
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ملخص المشروع *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المشكلة المحددة *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="solution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحل المقترح *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الأثر المتوقع *</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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