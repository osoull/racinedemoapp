import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionActions } from "./TransactionActions";
import { formatCurrency } from "@/utils/feeCalculations";

interface Transaction {
  id: string;
  user: {
    first_name: string;
    last_name: string;
  } | null;
  type: string;
  amount: number;
  fee_amount: number | null;
  status: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionList = ({ transactions, isLoading }: TransactionListProps) => {
  if (isLoading) {
    return <div className="text-center py-4">جاري التحميل...</div>;
  }

  return (
    <Table>
      <TransactionTableHeader />
      <TableBody>
        {transactions?.map((transaction) => (
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
            <TableCell>{formatCurrency(transaction.amount - (transaction.fee_amount || 0))}</TableCell>
            <TableCell>{formatCurrency(transaction.fee_amount || 0)}</TableCell>
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
              <TransactionActions 
                transactionId={transaction.id}
                status={transaction.status}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};