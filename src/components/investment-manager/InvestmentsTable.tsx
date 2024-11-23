import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface InvestmentsTableProps {
  investments: any[];
  onUpdateStatus: (investmentId: string, status: string) => void;
  isLoading: boolean;
}

const InvestmentsTable = ({ investments, onUpdateStatus, isLoading }: InvestmentsTableProps) => {
  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>المستثمر</TableHead>
          <TableHead>المشروع</TableHead>
          <TableHead>المبلغ</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investments?.map((investment) => (
          <TableRow key={investment.investment_id}>
            <TableCell>{investment.investor?.full_name}</TableCell>
            <TableCell>{investment.project?.title}</TableCell>
            <TableCell>{investment.amount}</TableCell>
            <TableCell>{investment.status}</TableCell>
            <TableCell>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(investment.investment_id, "confirmed")}
                  disabled={investment.status === "confirmed"}
                >
                  تأكيد
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(investment.investment_id, "cancelled")}
                  disabled={investment.status === "cancelled"}
                >
                  إلغاء
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvestmentsTable;