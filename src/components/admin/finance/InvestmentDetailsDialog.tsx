import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface InvestmentDetailsDialogProps {
  investment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvestmentDetailsDialog({ investment, open, onOpenChange }: InvestmentDetailsDialogProps) {
  const { data: history } = useQuery({
    queryKey: ["investment-history", investment.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          fee_tracking(*)
        `)
        .eq("id", investment.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: open
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>تفاصيل الاستثمار</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>معلومات أساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رقم المعاملة:</span>
                <span>{investment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المستثمر:</span>
                <span>{investment.user.first_name} {investment.user.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المبلغ:</span>
                <span>{investment.amount} ريال</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاريخ الاستثمار:</span>
                <span>{format(new Date(investment.created_at), "yyyy-MM-dd")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الفرصة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">عنوان الفرصة:</span>
                <span>{investment.investment.funding_request.title}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">الوصف:</span>
                <p className="text-sm">{investment.investment.funding_request.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الدفع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">طريقة الدفع:</span>
                <span>{investment.stripe_payments ? "بطاقة بنكية" : "تحويل بنكي"}</span>
              </div>
              {investment.stripe_payments && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم جلسة Stripe:</span>
                  <span>{investment.stripe_payments.stripe_session_id}</span>
                </div>
              )}
              {investment.bank_transactions && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم المرجع:</span>
                  <span>{investment.bank_transactions.reference_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">الرسوم:</span>
                <span>{history?.fee_tracking?.[0]?.fee_amount || 0} ريال</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Download className="ml-2 h-4 w-4" />
              تحميل إيصال الدفع
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}