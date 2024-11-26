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
import { calculateFees } from "@/utils/feeCalculations";

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
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const handleProjectDetailsSubmit = async (data: any) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب تسجيل الدخول لإتمام العملية",
      });
      return;
    }

    setProjectData({
      ...data,
      owner_id: user.id,
      status: 'draft',
    });
    setStep(2);
  };

  const createProject = async (transactionId?: string) => {
    try {
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          fees_transaction_id: transactionId,
          status: 'pending'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      toast({
        title: "تم إنشاء المشروع بنجاح",
        description: "سيتم مراجعة مشروعك من قبل فريق الإدارة"
      });

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء المشروع. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    await createProject(transactionId);
    setSubmissionType("card");
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
      const fees = calculateFees(projectData.funding_goal, commissions || [], 'borrower');

      // Create transaction first
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: fees.total,
          type: 'project_fee',
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Create bank transaction record
      const { error: bankTransactionError } = await supabase
        .from('bank_transactions')
        .insert({
          transaction_id: transaction.id,
          user_id: user.id,
          amount: fees.total,
          status: 'pending'
        });

      if (bankTransactionError) throw bankTransactionError;

      // Create the project with the transaction ID
      await createProject(transaction.id);
      setSubmissionType("bank");

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

  const fees = projectData ? calculateFees(projectData.funding_goal, commissions || [], 'borrower') : { admin: 0, collection: 0, total: 0 };

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