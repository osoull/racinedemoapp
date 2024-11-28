import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("ar-SA", {
        style: "currency",
        currency: "SAR",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "fee_amount",
    header: "الرسوم",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("fee_amount"))
      const formatted = new Intl.NumberFormat("ar-SA", {
        style: "currency",
        currency: "SAR",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={
          status === "completed" ? "success" :
          status === "failed" ? "destructive" :
          "secondary"
        }>
          {
            status === "pending" ? "قيد المعالجة" :
            status === "completed" ? "مكتمل" :
            status === "failed" ? "فشل" :
            status
          }
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "التاريخ",
    cell: ({ row }) => {
      return format(new Date(row.getValue("created_at")), "PPP", { locale: ar })
    },
  },
]