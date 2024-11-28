import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/feeCalculations"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<any>[] = [
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
    accessorKey: "funding_request_title",
    header: "المشروع",
  },
]