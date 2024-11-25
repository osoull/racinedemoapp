import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { formatCurrency } from "@/utils/feeCalculations"

interface CardPaymentProps {
  amount: string
  fees?: {
    admin: number;
    collection: number;
    investor: number;
    total: number;
  }
  onSuccess?: () => void
  userType?: string
}

export function CardPayment({ amount, fees, onSuccess, userType }: CardPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleCardPayment = async () => {
    if (!user || !amount) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال المبلغ وتسجيل الدخول للمتابعة",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    try {
      // Pour les emprunteurs, on ne prend que le montant des frais
      const paymentAmount = userType === 'borrower' && fees 
        ? fees.total 
        : Number(amount)

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount: paymentAmount,
          user_id: user.id,
          fees: fees
        }
      })

      if (error) throw error

      if (data?.sessionUrl) {
        window.location.href = data.sessionUrl
      } else {
        throw new Error('No session URL returned')
      }

      onSuccess?.()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "خطأ في عملية الدفع",
        description: "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Pour les emprunteurs, on affiche uniquement le montant total des frais
  const displayAmount = userType === 'borrower' && fees 
    ? fees.total 
    : Number(amount)

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2">
        {userType === 'borrower' && fees ? (
          <>
            <div className="flex justify-between">
              <span>رسوم الإدارة:</span>
              <span>{formatCurrency(fees.admin)}</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التحصيل:</span>
              <span>{formatCurrency(fees.collection)}</span>
            </div>
          </>
        ) : null}
        <div className="flex justify-between font-bold border-t pt-2">
          <span>المبلغ الإجمالي:</span>
          <span>{formatCurrency(displayAmount)}</span>
        </div>
      </div>

      <Button 
        onClick={handleCardPayment} 
        className="w-full"
        disabled={isLoading || !amount}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري المعالجة...
          </>
        ) : (
          `الدفع بالبطاقة (${formatCurrency(displayAmount)})`
        )}
      </Button>
    </div>
  )
}