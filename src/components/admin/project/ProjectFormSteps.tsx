import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectSubmissionFees } from "./ProjectSubmissionFees";
import { CardPayment } from "@/components/investor/wallet/deposit/CardPayment";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BankTransferDetails } from "@/components/investor/wallet/deposit/BankTransferDetails";

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

  const handleBankTransfer = async () => {
    try {
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            amount: projectData.funding_goal,
            type: 'deposit',
            status: 'pending'
          }
        ])

      if (transactionError) throw transactionError;

      toast({
        title: "تم تسجيل طلب التحويل",
        description: "سيتم تحديث رصيدك بعد التأكد من التحويل",
      });

      onSuccess?.();
    } catch (err) {
      console.error('Error creating bank transfer:', err);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل التحويل. يرجى المحاولة مرة أخرى.",
      });
    }
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
            <Tabs defaultValue="bank" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bank" className="space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>تحويل بنكي</span>
                </TabsTrigger>
                <TabsTrigger value="card" className="space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>بطاقة ائتمان</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bank" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    يرجى استخدام المعلومات البنكية أدناه لإتمام التحويل. سيتم تحديث رصيدك تلقائياً خلال يوم عمل واحد بعد استلام وتأكيد التحويل.
                  </AlertDescription>
                </Alert>
                <BankTransferDetails />
                <Button 
                  onClick={handleBankTransfer} 
                  className="w-full"
                >
                  تأكيد التحويل البنكي
                </Button>
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    سيتم تحويلك إلى صفحة الدفع الآمنة لإتمام العملية
                  </AlertDescription>
                </Alert>
                <CardPayment 
                  amount={projectData.funding_goal.toString()} 
                  onSuccess={handlePaymentSuccess}
                />
              </TabsContent>
            </Tabs>
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