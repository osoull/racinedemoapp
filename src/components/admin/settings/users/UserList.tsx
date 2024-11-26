import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionActions } from "@/components/admin/transaction/TransactionActions";
import { formatCurrency } from "@/utils/feeCalculations";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  email: string;
  created_at: string;
  kyc_status: string;
}

interface UserListProps {
  users?: User[];
  isLoading: boolean;
}

export function UserList({ users, isLoading }: UserListProps) {
  if (isLoading) {
    return <div className="text-center py-4">جاري التحميل...</div>;
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th className="text-right py-3 px-4">الاسم</th>
            <th className="text-right py-3 px-4">البريد الإلكتروني</th>
            <th className="text-right py-3 px-4">نوع المستخدم</th>
            <th className="text-right py-3 px-4">حالة KYC</th>
            <th className="text-right py-3 px-4">تاريخ التسجيل</th>
          </tr>
        </thead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {user.user_type === 'basic_investor' && 'مستثمر أساسي'}
                  {user.user_type === 'qualified_investor' && 'مستثمر مؤهل'}
                  {user.user_type === 'borrower' && 'طالب تمويل'}
                  {user.user_type === 'investment_manager' && 'مدير استثمار'}
                  {user.user_type === 'admin' && 'مشرف'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={
                  user.kyc_status === 'approved' ? 'default' :
                  user.kyc_status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {user.kyc_status === 'approved' ? 'معتمد' :
                   user.kyc_status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString('ar-SA')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}