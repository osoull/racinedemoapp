import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const projectSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  category: z.string().min(1, "تصنيف المشروع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  campaign_duration: z.number().min(1, "مدة الحملة مطلوبة"),
  description: z.string().min(50, "يجب أن يكون الوصف 50 حرفاً على الأقل"),
  fund_usage_plan: z.array(z.object({
    item: z.string(),
    amount: z.number()
  })).min(1, "يجب إضافة بند واحد على الأقل")
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function useProjectSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      fund_usage_plan: [{ item: "", amount: 0 }],
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لإتمام العملية",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('funding_requests')
        .insert({
          owner_id: user.id,
          title: data.title,
          description: data.description,
          funding_goal: data.funding_goal,
          category: data.category,
          campaign_duration: data.campaign_duration,
          fund_usage_plan: data.fund_usage_plan,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "تم حفظ المشروع",
        description: "تم حفظ معلومات المشروع بنجاح"
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المشروع",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting
  };
}