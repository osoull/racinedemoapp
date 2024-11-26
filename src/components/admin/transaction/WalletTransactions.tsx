import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tables } from "@/integrations/supabase/types"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { formatCurrency } from "@/utils/feeCalculations"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

type Transaction = Tables<"transactions"> & {
  user: { first_name: string; last_name: string } | null;
  investment: {
    amount: number;
    project: { title: string } | null;
  } | null;
  fee_details?: {
    type: string;
    amount: number;
  }[];
}

interface WalletTransactionsProps {
  transactions?: Transaction[]
  isLoading: boolean
}

export function WalletTransactions({ transactions, isLoading }: WalletTransactionsProps) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          جاري التحميل...
        </div>
      </Card>
    )
  }

  const handleUpdateStatus = async (transactionId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', transactionId)

      if (error) {
        toast.error('حدث خطأ أثناء تحديث حالة المعاملة')
        throw error
      }

      queryClient.invalidateQueries({ queryKey: ['transactions'] })

      toast.success(
        newStatus === 'completed' 
          ? 'تم اعتماد المعاملة بنجاح' 
          : 'تم رفض المعاملة بنجاح'
      )
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  const getFeeTypeLabel = (feeType: string) => {
    switch (feeType) {
      case 'admin_fee':
        return 'رسوم إدارية'
      case 'collection_fee':
        return 'رسوم تحصيل'
      case 'basic_investor_fee':
        return 'رسوم مستثمر أساسي'
      case 'qualified_investor_fee':
        return 'رسوم مستثمر مؤهل'
      default:
        return feeType
    }
  }

  return (
    <Card className="p-4">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم المعاملة</TableHead>
              <TableHead>المستخدم</TableHead>
              <TableHead>نوع المعاملة</TableHead>
              <TableHead>المبلغ الأساسي</TableHead>
              <TableHead>تفاصيل الرسوم</TableHead>
              <TableHead>إجمالي المعاملة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => {
              const principalAmount = transaction.amount - (transaction.fee_amount || 0)

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-xs">
                    {transaction.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {transaction.user ? 
                      `${transaction.user.first_name} ${transaction.user.last_name}` : 
                      'غير معروف'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {transaction.type === 'deposit' ? 'إيداع' : 
                       transaction.type === 'withdrawal' ? 'سحب' :
                       transaction.type === 'investment' ? 'استثمار' :
                       transaction.type === 'project_fee' ? 'رسوم مشروع' : 
                       transaction.type === 'fee' ? 'رسوم' :
                       'غير معروف'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(principalAmount)}</TableCell>
                  <TableCell>
                    {transaction.fee_amount > 0 ? (
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                          <ChevronDown className="h-4 w-4" />
                          <span>عرض التفاصيل</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-2">
                          {transaction.fee_details?.map((fee, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span>{getFeeTypeLabel(fee.type)}:</span>
                              <span>{formatCurrency(fee.amount)}</span>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <span className="text-muted-foreground text-sm">لا توجد رسوم</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      transaction.status === 'completed' ? 'default' :
                      transaction.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {transaction.status === 'completed' ? 'مكتمل' :
                       transaction.status === 'pending' ? 'قيد المعالجة' : 'ملغي'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    {transaction.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStatus(transaction.id, 'completed')}
                        >
                          اعتماد
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(transaction.id, 'cancelled')}
                        >
                          رفض
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  )
}