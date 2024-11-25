import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CreditCard, Building2, AlertCircle, ArrowDownLeft, Loader2 } from "lucide-react"
import { useBankDetails } from "@/hooks/useBankDetails"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BankTransferDetails } from "./deposit/BankTransferDetails"
import { AmountInput } from "./deposit/AmountInput"
import { CardPayment } from "./deposit/CardPayment"
import { useAuth } from "@/contexts/AuthContext"

interface DepositDialogProps {
  onSuccess?: () => void
}

export function DepositDialog({ onSuccess }: DepositDialogProps) {
  const [amount, setAmount] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [amountError, setAmountError] = useState<string>("")
  const { toast } = useToast()
  const { data: bankDetails, isLoading, error } = useBankDetails()
  const { user } = useAuth()

  const validateAmount = () => {
    if (!amount) {
      setAmountError("يرجى إدخال المبلغ")
      return false
    }
    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError("يرجى إدخال مبلغ صحيح")
      return false
    }
    setAmountError("")
    return true
  }

  const handleBankTransfer = async () => {
    if (!validateAmount() || !user) return

    try {
      setIsSubmitting(true)

      const { data, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            amount: Number(amount),
            type: 'deposit',
            status: 'pending'
          }
        ])
        .select()
        .single()

      if (transactionError) {
        throw transactionError
      }

      toast({
        title: "تم تسجيل طلب التحويل",
        description: "سيتم تحديث رصيدك بعد التأكد من التحويل",
      })

      setIsOpen(false)
      onSuccess?.()
    } catch (err) {
      console.error('Error creating bank transfer:', err)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل التحويل. يرجى المحاولة مرة أخرى.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setAmount("")
      setAmountError("")
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <ArrowDownLeft className="ml-2 h-4 w-4" />
          إيداع رصيد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إيداع رصيد</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <AmountInput 
            amount={amount} 
            setAmount={setAmount} 
            error={amountError}
          />

          <Tabs defaultValue="bank" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank" className="space-x-2">
                <Building2 className="h-4 w-4" />
                <span>تحويل بنكي</span>
              </TabsTrigger>
              <TabsTrigger value="card" className="space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>بطاقة ائتمان</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="space-y-4">
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  يرجى استخدام المعلومات البنكية أدناه لإتمام التحويل. سيتم تحديث رصيدك تلقائياً خلال يوم عمل واحد بعد استلام وتأكيد التحويل.
                </AlertDescription>
              </Alert>

              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    حدث خطأ أثناء تحميل المعلومات البنكية. يرجى المحاولة مرة أخرى لاحقاً.
                  </AlertDescription>
                </Alert>
              ) : (
                <BankTransferDetails 
                  bankDetails={bankDetails}
                  isLoading={isLoading}
                  error={error}
                />
              )}
              
              <Button 
                onClick={handleBankTransfer} 
                className="w-full"
                variant="default"
                disabled={isLoading || !!error || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  "تأكيد التحويل البنكي"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  سيتم تحويلك إلى صفحة الدفع الآمنة لإتمام العملية
                </AlertDescription>
              </Alert>
              <CardPayment amount={amount} onSuccess={onSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}