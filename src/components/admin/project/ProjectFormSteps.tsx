import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectSubmissionFees } from "./ProjectSubmissionFees";
import { CardPayment } from "@/components/investor/wallet/deposit/CardPayment";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";

interface ProjectFormStepsProps {
  project?: Tables<"projects"> | null;
  onSuccess?: () => void;
}

export const ProjectFormSteps = ({ project, onSuccess }: ProjectFormStepsProps) => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState<any>(null);
  const { toast } = useToast();

  const handleProjectDetailsSubmit = (data: any) => {
    setProjectData(data);
    setStep(2);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "تم الدفع بنجاح",
      description: "سيتم مراجعة طلبك من قبل فريق الإدارة"
    });
    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">تفاصيل المشروع</h2>
            <span className="text-sm text-muted-foreground">الخطوة 1 من 2</span>
          </div>
          <ProjectDetails 
            project={project}
            onSubmit={handleProjectDetailsSubmit}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">دفع الرسوم</h2>
            <span className="text-sm text-muted-foreground">الخطوة 2 من 2</span>
          </div>
          
          <ProjectSubmissionFees amount={projectData.funding_goal} />
          
          <div className="space-y-4">
            <h3 className="font-semibold">طريقة الدفع</h3>
            <CardPayment 
              amount={projectData.funding_goal.toString()} 
              onSuccess={handlePaymentSuccess}
            />
          </div>

          <Button 
            variant="outline" 
            onClick={() => setStep(1)}
            className="w-full mt-4"
          >
            العودة للخطوة السابقة
          </Button>
        </div>
      )}
    </div>
  );
};