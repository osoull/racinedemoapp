import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const projectSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  category: z.string().min(1, "تصنيف المشروع مطلوب"),
  location: z.string().min(1, "موقع المشروع مطلوب"),
  summary: z.string().min(50, "يجب أن يكون الملخص 50 حرفاً على الأقل"),
  objectives: z.array(z.string()).min(1, "يجب إضافة هدف واحد على الأقل"),
  problem: z.string().min(1, "وصف المشكلة مطلوب"),
  solution: z.string().min(1, "وصف الحل مطلوب"),
  impact: z.string().min(1, "وصف الأثر المتوقع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  fund_allocation: z.array(z.object({
    item: z.string(),
    amount: z.number()
  })).min(1, "يجب إضافة بند واحد على الأقل"),
  repayment_plan: z.string().min(1, "خطة السداد مطلوبة"),
  start_date: z.date(),
  end_date: z.date(),
  milestones: z.array(z.object({
    title: z.string(),
    date: z.date(),
    description: z.string()
  })).min(1, "يجب إضافة مرحلة واحدة على الأقل"),
  team_members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    experience: z.string(),
    linkedin: z.string().optional()
  })).min(1, "يجب إضافة عضو واحد على الأقل"),
  risks: z.array(z.object({
    description: z.string(),
    mitigation: z.string()
  })),
  partnerships: z.array(z.string()),
  market_research: z.string()
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function useProjectSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      objectives: [""],
      fund_allocation: [{ item: "", amount: 0 }],
      milestones: [{ title: "", date: new Date(), description: "" }],
      team_members: [{ name: "", role: "", experience: "" }],
      risks: [{ description: "", mitigation: "" }],
      partnerships: [""],
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
        .from('projects')
        .insert({
          owner_id: user.id,
          title: data.title,
          description: data.summary,
          funding_goal: data.funding_goal,
          classification: data.category,
          status: 'draft',
          metadata: {
            location: data.location,
            objectives: data.objectives,
            problem: data.problem,
            solution: data.solution,
            impact: data.impact,
            fund_allocation: data.fund_allocation,
            repayment_plan: data.repayment_plan,
            timeline: {
              start_date: data.start_date,
              end_date: data.end_date,
              milestones: data.milestones
            },
            team_members: data.team_members,
            risks: data.risks,
            partnerships: data.partnerships,
            market_research: data.market_research
          }
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