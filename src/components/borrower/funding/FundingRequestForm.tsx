import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { DocumentsStep } from "./steps/DocumentsStep";
import { PaymentStep } from "./steps/PaymentStep";
import { useProjectSubmission } from "@/hooks/useProjectSubmission";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BorrowerSidebar } from "@/components/borrower/BorrowerSidebar";

const steps = [
  { id: "basic-info", title: "المعلومات الأساسية" },
  { id: "documents", title: "المستندات المطلوبة" },
  { id: "payment", title: "دفع الرسوم" },
];

export function FundingRequestForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { form, onSubmit, isSubmitting } = useProjectSubmission();
  const { toast } = useToast();

  const nextStep = () => {
    const fields = steps[currentStep].id === "basic-info" 
      ? ["title", "category", "funding_goal", "campaign_duration", "description", "fund_usage_plan"]
      : [];

    form.trigger(fields).then((isValid) => {
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      }
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (data: z.infer<typeof projectSchema>) => {
    try {
      await onSubmit(data);
      toast({
        title: "تم إرسال الطلب",
        description: "سيتم مراجعة طلبك في أقرب وقت ممكن",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout sidebar={<BorrowerSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">طلب تمويل جديد</h2>
          <p className="text-muted-foreground">
            قم بتعبئة النموذج التالي لتقديم طلب تمويل جديد
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {steps[currentStep].title}
              </h3>
              <span className="text-sm text-muted-foreground">
                الخطوة {currentStep + 1} من {steps.length}
              </span>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {currentStep === 0 && <BasicInfoStep control={form.control} />}
              {currentStep === 1 && <DocumentsStep control={form.control} />}
              {currentStep === 2 && (
                <PaymentStep 
                  amount={form.getValues("funding_goal")} 
                  control={form.control}
                />
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  السابق
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                    إرسال الطلب
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep}>
                    التالي
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}