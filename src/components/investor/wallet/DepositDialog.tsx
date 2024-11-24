import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CreditCard, Building2 } from "lucide-react"
import BankDetails from "@/components/admin/BankDetails"

interface DepositDialogProps {
  onSuccess?: () => void;
}

export function DepositDialog({ onSuccess }: DepositDialogProps) {
  const [amount, setAmount] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleCardDeposit = async () => {
    // TODO: Implement Stripe integration
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
        title: "تم إرسال طلب الإيداع",
        description: "سيتم مراجعة التحويل وتحديث رصيدك قريباً"
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
          إيداع رصيد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إيداع رصيد</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>المبلغ</Label>
            <Input
              type="number"
              placeholder="أدخل المبلغ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

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
              <div className="rounded-lg border p-4 space-y-4">
                <BankDetails />
              </div>
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