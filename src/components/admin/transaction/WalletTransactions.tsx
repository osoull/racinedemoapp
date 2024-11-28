import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/feeCalculations"
import { Transaction } from "@/types/investment"

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "رقم المعاملة",
    cell: ({ row }) => <span className="font-mono">{row.original.id.slice(0, 8)}...</span>,
  },
  {
    accessorKey: "type",
    header: "نوع المعاملة",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.type === "deposit"
          ? "إيداع"
          : row.original.type === "withdrawal"
          ? "سحب"
          : "استثمار"}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "completed"
            ? "default"
            : row.original.status === "pending"
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.status === "completed"
          ? "مكتمل"
          : row.original.status === "pending"
          ? "قيد المعالجة"
          : "ملغي"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "التاريخ",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("ar-SA"),
  },
]

interface WalletTransactionsProps {
  transactions: Transaction[] | null
  isLoading: boolean
}

export function WalletTransactions({ transactions, isLoading }: WalletTransactionsProps) {
  return (
    <DataTable
      columns={columns}
      data={transactions || []}
      isLoading={isLoading}
    />
  )
}