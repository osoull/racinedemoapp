import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CardPaymentProps {
  amount: string;
  onSuccess?: (transactionId: string) => void;
}

export const CardPayment = ({ amount, onSuccess }: CardPaymentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب تسجيل الدخول لإتمام العملية",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create transaction first
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: Number(amount),
          type: 'project_fee',
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          user_id: user.id,
          transaction_id: transaction.id
        }),
      });

      const { sessionUrl } = await response.json();

      if (sessionUrl) {
        onSuccess?.(transaction.id);
        window.location.href = sessionUrl;
      } else {
        throw new Error('No session URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء إنشاء جلسة الدفع. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "جاري التحميل..." : "الدفع بالبطاقة"}
    </Button>
  );
};