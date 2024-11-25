import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CardPaymentProps {
  amount: string
  onSuccess?: () => void
}

export function CardPayment({ amount, onSuccess }: CardPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleCardPayment = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount: Number(amount), user_id: user.id }
      })

      if (error) throw error

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl
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

  return (
    <Button 
      onClick={handleCardPayment} 
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          جاري المعالجة...
        </>
      ) : (
        'الدفع بالبطاقة'
      )}
    </Button>
  )
}