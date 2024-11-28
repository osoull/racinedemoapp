import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface RefundDialogProps {
  investment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RefundDialog({ investment, open, onOpenChange }: RefundDialogProps) {
  const [amount, setAmount] = useState(investment.amount)
  const [reason, setReason] = useState("")
  const queryClient = useQueryClient()

  const { mutate: processRefund, isPending } = useMutation({
    mutationFn: async () => {
      // Créer une nouvelle transaction de remboursement
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: investment.user_id,
          amount: amount,
          type: "refund",
          status: "completed",
          related_transaction_id: investment.id
        })
        .select()
        .single()

      if (error) throw error

      // Mettre à jour le statut de l'investissement original
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ status: "refunded" })
        .eq("id", investment.id)

      if (updateError) throw updateError

      return data
    },
    onSuccess: () => {
      toast.success("تم إجراء عملية الاسترداد بنجاح")
      queryClient.invalidateQueries({ queryKey: ["investments"] })
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء عملية الاسترداد")
      console.error("Refund error:", error)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>استرداد الاستثمار</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>المبلغ المسترد</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              max={investment.amount}
              dir="ltr"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label>سبب الاسترداد</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-right"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            onClick={() => processRefund()}
            disabled={!amount || !reason || isPending}
          >
            تأكيد الاسترداد
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}