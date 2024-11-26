import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GeneralInfo } from "./sections/GeneralInfo";
import { ProjectDescription } from "./sections/ProjectDescription";
import { FinancialDetails } from "./sections/FinancialDetails";
import { ProjectTimeline } from "./sections/ProjectTimeline";
import { TeamMembers } from "./sections/TeamMembers";
import { ProjectDocuments } from "./sections/ProjectDocuments";
import { AdditionalInfo } from "./sections/AdditionalInfo";
import { PaymentSection } from "./sections/PaymentSection";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const projectSchema = z.object({
  // Section Informations Générales
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  category: z.string().min(1, "تصنيف المشروع مطلوب"),
  location: z.string().min(1, "موقع المشروع مطلوب"),
  
  // Section Description
  summary: z.string().min(50, "يجب أن يكون الملخص 50 حرفاً على الأقل"),
  objectives: z.array(z.string()).min(1, "يجب إضافة هدف واحد على الأقل"),
  problem: z.string().min(1, "وصف المشكلة مطلوب"),
  solution: z.string().min(1, "وصف الحل مطلوب"),
  impact: z.string().min(1, "وصف الأثر المتوقع مطلوب"),
  
  // Section Financière
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  fund_allocation: z.array(z.object({
    item: z.string(),
    amount: z.number()
  })).min(1, "يجب إضافة بند واحد على الأقل"),
  repayment_plan: z.string().min(1, "خطة السداد مطلوبة"),
  
  // Section Calendrier
  start_date: z.date(),
  end_date: z.date(),
  milestones: z.array(z.object({
    title: z.string(),
    date: z.date(),
    description: z.string()
  })).min(1, "يجب إضافة مرحلة واحدة على الأقل"),
  
  // Section Équipe
  team_members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    experience: z.string(),
    linkedin: z.string().optional()
  })).min(1, "يجب إضافة عضو واحد على الأقل"),
  
  // Section Informations Supplémentaires
  risks: z.array(z.object({
    description: z.string(),
    mitigation: z.string()
  })),
  partnerships: z.array(z.string()),
  market_research: z.string()
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectForm() {
  const [currentTab, setCurrentTab] = useState("general");
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          owner_id: user.id,
          title: data.title,
          description: data.summary,
          funding_goal: data.funding_goal,
          classification: data.category,
          status: 'draft',
          // Additional metadata stored as JSON
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
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم حفظ المشروع",
        description: "تم حفظ معلومات المشروع بنجاح"
      });

      // Redirect to payment section
      setCurrentTab("payment");
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

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-8">
              <TabsTrigger value="general">معلومات عامة</TabsTrigger>
              <TabsTrigger value="description">وصف المشروع</TabsTrigger>
              <TabsTrigger value="financial">التفاصيل المالية</TabsTrigger>
              <TabsTrigger value="timeline">الجدول الزمني</TabsTrigger>
              <TabsTrigger value="team">فريق العمل</TabsTrigger>
              <TabsTrigger value="documents">المستندات</TabsTrigger>
              <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
              <TabsTrigger value="payment">الدفع</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralInfo control={form.control} />
            </TabsContent>

            <TabsContent value="description">
              <ProjectDescription control={form.control} />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialDetails control={form.control} />
            </TabsContent>

            <TabsContent value="timeline">
              <ProjectTimeline control={form.control} />
            </TabsContent>

            <TabsContent value="team">
              <TeamMembers control={form.control} />
            </TabsContent>

            <TabsContent value="documents">
              <ProjectDocuments />
            </TabsContent>

            <TabsContent value="additional">
              <AdditionalInfo control={form.control} />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentSection />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentIndex = ["general", "description", "financial", "timeline", "team", "documents", "additional", "payment"].indexOf(currentTab);
                if (currentIndex > 0) {
                  setCurrentTab(["general", "description", "financial", "timeline", "team", "documents", "additional", "payment"][currentIndex - 1]);
                }
              }}
              disabled={currentTab === "general"}
            >
              السابق
            </Button>

            {currentTab !== "payment" && (
              <Button
                type="button"
                onClick={() => {
                  const currentIndex = ["general", "description", "financial", "timeline", "team", "documents", "additional", "payment"].indexOf(currentTab);
                  if (currentIndex < 7) {
                    setCurrentTab(["general", "description", "financial", "timeline", "team", "documents", "additional", "payment"][currentIndex + 1]);
                  }
                }}
              >
                التالي
              </Button>
            )}

            {currentTab === "payment" && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري الحفظ..." : "تأكيد وإرسال"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
}