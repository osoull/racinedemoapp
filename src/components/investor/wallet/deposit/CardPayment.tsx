import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CardPaymentProps {
  amount: string;
  onSuccess?: (transactionId: string) => void;
}

export const CardPayment = ({ amount, onSuccess }: CardPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لإتمام عملية الدفع",
        variant: "destructive",
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
      console.error('Error creating payment:', error);
      toast({
        title: "خطأ في عملية الدفع",
        description: "حدث خطأ أثناء إنشاء عملية الدفع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
    >
      {isLoading ? "جاري التجهيز..." : "الدفع بالبطاقة"}
    </button>
  );
};