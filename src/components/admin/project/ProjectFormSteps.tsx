import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectFeeDetails } from "./ProjectFeeDetails";
import { CardPayment } from "@/components/investor/wallet/deposit/CardPayment";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BankTransferDetails } from "@/components/investor/wallet/deposit/BankTransferDetails";
import { supabase } from "@/integrations/supabase/client";
import { useBankDetails } from "@/hooks/useBankDetails";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectFormStepsProps {
  project?: Tables<"projects"> | null;
  onSuccess?: () => void;
}

export const ProjectFormSteps = ({ project, onSuccess }: ProjectFormStepsProps) => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState<any>(project || null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<"bank" | "card" | null>(null);
  const { toast } = useToast();
  const { data: bankDetails, isLoading, error } = useBankDetails();
  const { user } = useAuth();

  const { data: commissions } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
      
      if (error) throw error
      return data
    },
  });

  const calculateTotalFees = (amount: number) => {
    const adminFee = commissions?.find(c => c.commission_type === 'admin_fee')?.rate || 0;
    const collectionFee = commissions?.find(c => c.commission_type === 'collection_fee')?.rate || 0;
    return (amount * (adminFee + collectionFee)) / 100;
  };

  const handleProjectDetailsSubmit = (data: any) => {
    setProjectData(data);
    setStep(2);
  };

  const handlePaymentSuccess = () => {
    setIsSubmitted(true);
    setSubmissionType("card");
    toast({
      title: "تم الدفع بنجاح",
      description: "سيتم مراجعة طلبك من قبل فريق الإدارة"
    });
    onSuccess?.();
  };

  const handleBankTransfer = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب تسجيل الدخول لإتمام العملية",
      });
      return;
    }

    try {
      const totalFees = calculateTotalFees(projectData.funding_goal);

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          amount: totalFees,
          type: 'project_fee',
          status: 'pending',
          user_id: user.id,
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          owner_id: user.id,
          status: 'pending',
          fees_transaction_id: transaction.id
        });

      if (projectError) throw projectError;

      setIsSubmitted(true);
      setSubmissionType("bank");
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

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4 py-8">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-semibold">تم تقديم المشروع بنجاح!</h2>
        {submissionType === "bank" ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              تم استلام طلب التحويل البنكي الخاص بك. سيتم مراجعة المشروع بمجرد التأكد من التحويل.
            </p>
            <Alert>
              <AlertDescription>
                يرجى الاحتفاظ بإيصال التحويل البنكي للرجوع إليه عند الحاجة.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <p className="text-muted-foreground">
            تم استلام الدفع بنجاح. سيتم مراجعة مشروعك من قبل فريق الإدارة وسنخبرك بأي تحديثات.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">تفاصيل المشروع</h2>
            <span className="text-sm text-muted-foreground">الخطوة 1 من 2</span>
          </div>
          <ProjectDetails 
            project={projectData}
            onSubmit={handleProjectDetailsSubmit}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">دفع الرسوم</h2>
            <span className="text-sm text-muted-foreground">الخطوة 2 من 2</span>
          </div>
          
          <ProjectFeeDetails amount={projectData.funding_goal} />
          
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
                <BankTransferDetails 
                  bankDetails={bankDetails}
                  isLoading={isLoading}
                  error={error}
                />
                <Button 
                  onClick={handleBankTransfer} 
                  className="w-full"
                  disabled={!bankDetails}
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
                  amount={calculateTotalFees(projectData.funding_goal).toString()} 
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