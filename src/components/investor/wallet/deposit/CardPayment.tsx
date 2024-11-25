import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface CardPaymentProps {
  amount: string;
  onSuccess?: () => void;
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

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          user_id: user.id,
        }),
      });

      const { sessionUrl } = await response.json();

      if (sessionUrl) {
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