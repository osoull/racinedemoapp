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

interface DepositDialogProps {
  onSuccess?: () => void
}

export function DepositDialog({ onSuccess }: DepositDialogProps) {
  const [amount, setAmount] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [amountError, setAmountError] = useState<string>("")
  const { toast } = useToast()
  const { data: bankDetails, isLoading, error } = useBankDetails()

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

  const handleCardDeposit = async () => {
    toast({
      title: "قريباً",
      description: "سيتم إضافة خدمة الدفع بالبطاقة قريباً"
    })
  }

  const handleBankTransfer = async () => {
    if (!validateAmount()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("transactions")
        .insert({
          type: "deposit",
          amount: Number(amount),
          status: "pending",
          user_id: user.id
        })

      if (error) throw error

      toast({
        title: "تم تسجيل طلب الإيداع بنجاح",
        description: "يرجى إتمام التحويل البنكي باستخدام المعلومات المقدمة. سيتم تحديث رصيدك خلال يوم عمل واحد بعد استلام التحويل."
      })
      setIsOpen(false)
      setAmount("")
      onSuccess?.()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال طلب الإيداع",
        variant: "destructive"
      })
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setAmount("")
      setAmountError("")
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
                disabled={isLoading || !!error}
              >
                تأكيد التحويل البنكي
              </Button>
            </TabsContent>

            <TabsContent value="card">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  سيتم تفعيل خدمة الدفع بالبطاقة قريباً
                </p>
                <Button onClick={handleCardDeposit} className="w-full" disabled>
                  الدفع بالبطاقة
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}