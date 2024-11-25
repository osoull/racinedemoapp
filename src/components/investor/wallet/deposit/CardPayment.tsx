import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { formatCurrency } from "@/utils/feeCalculations"
import { UserType } from "@/types/user"

interface CardPaymentProps {
  amount: string
  onSuccess?: () => void
}

export function CardPayment({ amount, onSuccess }: CardPaymentProps) {
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
      const amountNumber = Number(amount)
      const userProfile = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (!userProfile.data) throw new Error('User profile not found')

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount: amountNumber,
          user_id: user.id
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

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2">
        <div className="flex justify-between font-bold border-t pt-2">
          <span>المبلغ الإجمالي:</span>
          <span>{formatCurrency(amountNumber)}</span>
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
          `الدفع بالبطاقة (${formatCurrency(amountNumber)})`
        )}
      </Button>
    </div>
  )
}