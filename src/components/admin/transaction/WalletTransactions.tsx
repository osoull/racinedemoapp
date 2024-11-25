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

type Transaction = Tables<"transactions"> & {
  user: { first_name: string; last_name: string } | null;
  investment: {
    amount: number;
    project: { title: string } | null;
  } | null;
  fees?: {
    admin: number;
    collection: number;
    investor: number;
    total: number;
  }
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
              const fees = transaction.fees || {
                admin: 0,
                collection: 0,
                investor: 0,
                total: 0
              }
              
              const principalAmount = transaction.amount - fees.total

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
                       'غير معروف'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(principalAmount)}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      {fees.admin > 0 && (
                        <div>رسوم إدارية: {formatCurrency(fees.admin)}</div>
                      )}
                      {fees.collection > 0 && (
                        <div>رسوم تحصيل: {formatCurrency(fees.collection)}</div>
                      )}
                      {fees.investor > 0 && (
                        <div>رسوم مستثمر: {formatCurrency(fees.investor)}</div>
                      )}
                      {fees.total === 0 && (
                        <div className="text-muted-foreground">لا توجد رسوم</div>
                      )}
                    </div>
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