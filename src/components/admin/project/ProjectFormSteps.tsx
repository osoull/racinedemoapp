import { useState } from "react";
import { ProjectDetails } from "./ProjectDetails";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ProjectPaymentStep } from "./ProjectPaymentStep";

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

  const calculateFees = (amount: number) => {
    const adminFee = commissions?.find(c => c.commission_type === 'admin_fee')?.rate || 0;
    const collectionFee = commissions?.find(c => c.commission_type === 'collection_fee')?.rate || 0;
    
    const calculatedAdminFee = (amount * adminFee) / 100;
    const calculatedCollectionFee = (amount * collectionFee) / 100;
    
    return {
      admin: calculatedAdminFee,
      collection: calculatedCollectionFee,
      total: calculatedAdminFee + calculatedCollectionFee
    };
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
      const fees = calculateFees(projectData.funding_goal);

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          amount: fees.total,
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

  const fees = projectData ? calculateFees(projectData.funding_goal) : { admin: 0, collection: 0, total: 0 };

  return (
    <div className="space-y-6">
      {step === 1 ? (
        <ProjectDetails 
          project={projectData}
          onSubmit={handleProjectDetailsSubmit}
        />
      ) : (
        <ProjectPaymentStep
          projectData={projectData}
          fees={fees}
          onBankTransfer={handleBankTransfer}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => setStep(1)}
        />
      )}
    </div>
  );
};