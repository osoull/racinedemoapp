import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface InvestmentsTableProps {
  investments: any[]
  isLoading: boolean
  onViewDetails: (investment: any) => void
  onRefund: (investment: any) => void
}

export function InvestmentsTable({ investments, isLoading, onViewDetails, onRefund }: InvestmentsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (!investments.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">لا توجد استثمارات</p>
      </div>
    )
  }

  return (
    <div className="text-right" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المستثمر</TableHead>
            <TableHead>الفرصة</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead>طريقة الدفع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell>
                {investment.user.first_name} {investment.user.last_name}
              </TableCell>
              <TableCell>{investment.investment.funding_request.title}</TableCell>
              <TableCell>{investment.amount} ريال</TableCell>
              <TableCell>
                {investment.stripe_payments ? "بطاقة بنكية" : "تحويل بنكي"}
              </TableCell>
              <TableCell>
                <Badge variant={
                  investment.status === "completed" ? "success" :
                  investment.status === "pending" ? "warning" : "destructive"
                }>
                  {investment.status === "completed" ? "مكتمل" :
                   investment.status === "pending" ? "قيد المعالجة" : "فشل"}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(investment.created_at), "yyyy-MM-dd")}</TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(investment)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {investment.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRefund(investment)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}