import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tables } from "@/integrations/supabase/types"

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
  if (isLoading) return <div>جاري التحميل...</div>

  const walletTransactions = transactions?.filter(t => 
    t.type === 'deposit' || t.type === 'withdrawal'
  )

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
              <TableCell>{transaction.amount.toLocaleString()} ريال</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}