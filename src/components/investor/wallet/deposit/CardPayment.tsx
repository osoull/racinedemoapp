import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { calculateFees, formatCurrency } from "@/utils/feeCalculations"

interface CardPaymentProps {
  amount: string
  onSuccess?: () => void
}

export function CardPayment({ amount, onSuccess }: CardPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const { data: commissions } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
      
      if (error) throw error
      return data
    },
  })

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
      const amountNumber = Number(amount)
      const fees = calculateFees(amountNumber, commissions || [], user.user_type)
      const totalAmount = amountNumber + fees.total

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount: totalAmount,
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

  const amountNumber = Number(amount)
  const fees = calculateFees(amountNumber, commissions || [], user?.user_type)
  const totalAmount = amountNumber + fees.total

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span>المبلغ الأساسي:</span>
          <span>{formatCurrency(amountNumber)}</span>
        </div>
        {fees.admin > 0 && (
          <div className="flex justify-between">
            <span>رسوم الإدارة:</span>
            <span>{formatCurrency(fees.admin)}</span>
          </div>
        )}
        {fees.collection > 0 && (
          <div className="flex justify-between">
            <span>رسوم التحصيل:</span>
            <span>{formatCurrency(fees.collection)}</span>
          </div>
        )}
        {fees.investor > 0 && (
          <div className="flex justify-between">
            <span>رسوم المستثمر:</span>
            <span>{formatCurrency(fees.investor)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t pt-2">
          <span>المبلغ الإجمالي:</span>
          <span>{formatCurrency(totalAmount)}</span>
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
          `الدفع بالبطاقة (${formatCurrency(totalAmount)})`
        )}
      </Button>
    </div>
  )
}