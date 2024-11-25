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
  onSuccess?: () => void
}

export function CardPayment({ amount, onSuccess }: CardPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const { data: userProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .single()
      return data
    },
    enabled: !!user?.id
  })

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

  const calculateTotalFees = () => {
    if (!commissions || !amount) return 0
    const amountNumber = Number(amount)
    const adminFee = commissions.find(c => c.commission_type === 'admin_fee')?.rate || 0
    const collectionFee = commissions.find(c => c.commission_type === 'collection_fee')?.rate || 0
    
    return (amountNumber * (adminFee + collectionFee)) / 100
  }

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
      const amountToCharge = userProfile?.user_type === 'borrower' ? calculateTotalFees() : Number(amount)

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount: amountToCharge,
          user_id: user.id
        }
      })

      if (error) {
        console.error('Payment function error:', error)
        throw new Error(error.message || 'حدث خطأ أثناء معالجة الدفع')
      }

      if (!data?.sessionUrl) {
        throw new Error('لم يتم إنشاء جلسة الدفع')
      }

      window.location.href = data.sessionUrl
      onSuccess?.()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "خطأ في عملية الدفع",
        description: error.message || "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const displayAmount = userProfile?.user_type === 'borrower' ? calculateTotalFees() : Number(amount)

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2">
        <div className="flex justify-between font-bold border-t pt-2">
          <span>{userProfile?.user_type === 'borrower' ? 'المبلغ الإجمالي للرسوم:' : 'المبلغ الإجمالي:'}</span>
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