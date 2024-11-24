import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CreditCard, Building2, AlertCircle, ArrowDownLeft } from "lucide-react"
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
  const { toast } = useToast()
  const { data: bankDetails, isLoading, error } = useBankDetails()

  const handleCardDeposit = async () => {
    toast({
      title: "قريباً",
      description: "سيتم إضافة خدمة الدفع بالبطاقة قريباً"
    })
  }

  const handleBankTransfer = async () => {
    try {
      const { error } = await supabase
        .from("transactions")
        .insert({
          type: "deposit",
          amount: Number(amount),
          status: "pending"
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowDownLeft className="ml-2 h-4 w-4" />
          إيداع رصيد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إيداع رصيد</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <AmountInput amount={amount} setAmount={setAmount} />

          <Tabs defaultValue="bank">
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
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  يرجى استخدام المعلومات البنكية أدناه لإتمام التحويل. سيتم تحديث رصيدك تلقائياً خلال يوم عمل واحد بعد استلام وتأكيد التحويل.
                </AlertDescription>
              </Alert>

              <BankTransferDetails 
                bankDetails={bankDetails}
                isLoading={isLoading}
                error={error}
              />
              
              <Button onClick={handleBankTransfer} className="w-full">
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