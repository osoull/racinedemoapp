import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { DataTable } from "@/components/ui/data-table"
import { Loader2 } from "lucide-react"
import { useBorrowerPayments } from "@/hooks/useBorrowerPayments"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/feeCalculations"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "payment_date",
    header: "التاريخ",
    cell: ({ row }) => new Date(row.getValue("payment_date")).toLocaleDateString("ar-SA"),
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => formatCurrency(row.getValue("amount")),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={
          status === "completed" ? "default" :
          status === "pending" ? "secondary" :
          "destructive"
        }>
          {status === "completed" ? "مكتمل" :
           status === "pending" ? "قيد المعالجة" :
           "فشل"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "payment_type",
    header: "نوع الدفع",
    cell: ({ row }) => {
      const type = row.getValue("payment_type") as string
      return type === "fee_payment" ? "رسوم" : "دفعة"
    },
  },
  {
    accessorKey: "funding_request_title",
    header: "المشروع",
  },
]

export function BorrowerPayments() {
  const { user } = useAuth()
  const { data: payments, isLoading } = useBorrowerPayments()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">المدفوعات</h2>
        <p className="text-muted-foreground">
          إدارة ومتابعة جميع المدفوعات
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>سجل المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={payments || []} />
        </CardContent>
      </Card>
    </div>
  )
}
