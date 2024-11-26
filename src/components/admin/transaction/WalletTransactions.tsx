import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tables } from "@/integrations/supabase/types"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { formatCurrency } from "@/utils/feeCalculations"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TransactionTableHeader } from "./TransactionTableHeader"
import { TransactionFeeDetails } from "./TransactionFeeDetails"
import { TransactionStatusBadge } from "./TransactionStatusBadge"

type Transaction = Tables<"transactions"> & {
  user: { first_name: string; last_name: string } | null
  investment: {
    amount: number
    project: { title: string } | null
  } | null
  fee_details?: {
    type: string
    amount: number
  }[]
}

interface WalletTransactionsProps {
  transactions?: Transaction[]
  isLoading: boolean
}

export function WalletTransactions({ transactions, isLoading }: WalletTransactionsProps) {
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

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          جاري التحميل...
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <ScrollArea className="h-[600px]">
        <Table>
          <TransactionTableHeader />
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
                    <TransactionFeeDetails 
                      feeAmount={transaction.fee_amount}
                      feeDetails={transaction.fee_details}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={transaction.status} />
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