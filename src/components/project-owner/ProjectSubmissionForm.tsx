import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectDocumentUpload } from "../admin/project/ProjectDocumentUpload";
import { ProjectClassification } from "../admin/project/ProjectClassification";
import { ProjectInvestmentLimits } from "../admin/project/ProjectInvestmentLimits";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  shariahCompliant: z.boolean().refine(val => val === true, {
    message: "يجب أن يكون المشروع متوافقاً مع الشريعة الإسلامية"
  })
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export const ProjectSubmissionForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      funding_goal: 1000,
      min_investment: 1000,
      classification: "تمويل مشاريع طرف ثاني",
      shariahCompliant: false
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
        status: 'pending'
      };
      
      const { error } = await supabase.from("projects").insert(projectData);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال المشروع بنجاح",
        description: "سيتم مراجعة مشروعك من قبل فريقنا"
      });
      navigate("/project-owner/dashboard");
    },
    onError: (error) => {
      toast({
        title: "خطأ في إرسال المشروع",
        description: "حدث خطأ أثناء محاولة إرسال المشروع",
        variant: "destructive",
      });
      console.error("Error creating project:", error);
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    if (isPreview) {
      setIsPreview(false);
      return;
    }
    createProjectMutation.mutate(values);
  };

  if (isPreview) {
    const values = form.getValues();
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{values.title}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">وصف المشروع</h3>
              <p className="text-gray-600">{values.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">المبلغ المستهدف</h3>
                <p className="text-gray-600">{values.funding_goal} ريال</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">الحد الأدنى للاستثمار</h3>
                <p className="text-gray-600">{values.min_investment} ريال</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">تصنيف المشروع</h3>
              <p className="text-gray-600">{values.classification}</p>
            </div>
          </div>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setIsPreview(false)}>
            تعديل المشروع
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            إرسال المشروع
          </Button>
        </div>
      </div>
    );
  }

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
              title="خطة العمل"
              description="يرجى رفع الملف بصيغة PDF"
              type="business_plan"
            />

            <ProjectDocumentUpload
              title="دراسة السوق"
              description="يرجى رفع الملف بصيغة PDF"
              type="market_study"
            />

            <ProjectDocumentUpload
              title="وثائق الامتثال الشرعي"
              description="يرجى رفع الملف بصيغة PDF"
              type="shariah_compliance"
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="shariahCompliant"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  أؤكد أن هذا المشروع متوافق مع مبادئ الشريعة الإسلامية
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={() => setIsPreview(true)}>
            معاينة
          </Button>
          <Button type="submit">
            إرسال المشروع
          </Button>
        </div>
      </form>
    </Form>
  );
};