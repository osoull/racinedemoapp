import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tables } from "@/integrations/supabase/types"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

type Transaction = Tables<"transactions"> & {
  user: { first_name: string; last_name: string } | null;
  investment: {
    amount: number;
    project: { title: string } | null;
  } | null;
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

  if (isLoading) return <div>جاري التحميل...</div>

  const walletTransactions = transactions?.filter(t => 
    t.type === 'deposit' || t.type === 'withdrawal'
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
  }

  const handleUpdateStatus = async (transactionId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', transactionId)

      if (error) throw error

      toast.success(
        newStatus === 'completed' 
          ? 'تم اعتماد المعاملة بنجاح' 
          : 'تم رفض المعاملة بنجاح'
      )
    } catch (error) {
      console.error('Error updating transaction:', error)
      toast.error('حدث خطأ أثناء تحديث حالة المعاملة')
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المستخدم</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {walletTransactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {transaction.user ? 
                  `${transaction.user.first_name} ${transaction.user.last_name}` : 
                  'غير معروف'
                }
              </TableCell>
              <TableCell>
                {transaction.type === 'deposit' ? 'إيداع' : 'سحب'}
              </TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}