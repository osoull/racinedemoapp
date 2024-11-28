import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { WalletTransactions } from "@/components/admin/transaction/WalletTransactions"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DepositDialog } from "./DepositDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Transaction } from "@/types/investment"

export function WalletOverview() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

  const { data: transactions, isLoading, refetch } = useQuery<Transaction[]>({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:profiles(first_name, last_name)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  const handleWithdraw = async () => {
    try {
      const { error } = await supabase
        .from("transactions")
        .insert({
          type: "withdrawal",
          amount: Number(amount),
          status: "pending",
          user_id: user?.id
        })

      if (error) throw error

      toast({
        title: "تم إرسال طلب السحب",
        description: "سيتم مراجعة طلبك وتحديث حالته قريباً"
      })
      setIsWithdrawOpen(false)
      setAmount("")
      refetch()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال طلب السحب",
        variant: "destructive"
      })
    }
  }

  const balance = transactions?.reduce((sum, t) => {
    if (t.status !== 'completed') return sum
    if (t.type === 'deposit') return sum + t.amount
    if (t.type === 'withdrawal') return sum - t.amount
    return sum
  }, 0) || 0

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الرصيد الحالي</p>
              <h2 className="text-2xl font-bold">{balance.toLocaleString()} ريال</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <DepositDialog open={false} onOpenChange={() => {}} />

            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                  سحب
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>سحب رصيد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>المبلغ</Label>
                    <Input
                      type="number"
                      placeholder="أدخل المبلغ"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleWithdraw} className="w-full">
                    تأكيد السحب
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">سجل المعاملات</h3>
        <WalletTransactions transactions={transactions} isLoading={isLoading} />
      </Card>
    </div>
  )
}