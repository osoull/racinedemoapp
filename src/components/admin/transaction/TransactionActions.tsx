import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TransactionActionsProps {
  transactionId: string;
  status: string;
}

export const TransactionActions = ({ transactionId, status }: TransactionActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleValidatePayment = async (approved: boolean) => {
    try {
      setIsProcessing(true);
      
      const { error } = await supabase.rpc('validate_payment', {
        p_transaction_id: transactionId,
        p_status: approved ? 'completed' : 'cancelled',
        p_notes: approved ? 'تم التحقق من التحويل البنكي' : 'تم رفض التحويل البنكي'
      });

      if (error) throw error;

      toast({
        title: approved ? "تم اعتماد الدفع" : "تم رفض الدفع",
        description: approved ? "تم التحقق من التحويل البنكي واعتماد المعاملة" : "تم رفض التحويل البنكي"
      });

      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من معالجة الطلب",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (status !== 'pending') {
    return null;
  }

  return (
    <div className="space-x-2 rtl:space-x-reverse">
      <Button
        variant="default"
        size="sm"
        onClick={() => handleValidatePayment(true)}
        disabled={isProcessing}
      >
        اعتماد
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleValidatePayment(false)}
        disabled={isProcessing}
      >
        رفض
      </Button>
    </div>
  );
};