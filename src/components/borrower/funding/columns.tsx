import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "عنوان الطلب",
  },
  {
    accessorKey: "funding_goal",
    header: "المبلغ المطلوب",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("funding_goal"))
      const formatted = new Intl.NumberFormat("ar-SA", {
        style: "currency",
        currency: "SAR",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "current_funding",
    header: "التمويل الحالي",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("current_funding"))
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
          status === "approved" ? "success" :
          status === "rejected" ? "destructive" :
          status === "under_review" ? "warning" :
          "secondary"
        }>
          {
            status === "draft" ? "مسودة" :
            status === "submitted" ? "تم التقديم" :
            status === "under_review" ? "قيد المراجعة" :
            status === "approved" ? "تمت الموافقة" :
            status === "rejected" ? "مرفوض" :
            status
          }
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => {
      return format(new Date(row.getValue("created_at")), "PPP", { locale: ar })
    },
  },
]