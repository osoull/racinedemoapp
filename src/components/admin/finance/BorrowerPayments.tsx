import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/feeCalculations"

interface BorrowerPayment {
  id: string
  amount: number
  status: string
  created_at: string
  borrower: {
    first_name: string
    last_name: string
  }
  funding_request: {
    title: string
    current_funding: number
  }
}

const columns: ColumnDef<BorrowerPayment>[] = [
  {
    accessorKey: "borrower",
    header: "المقترض",
    cell: ({ row }) => (
      <span>
        {row.original.borrower.first_name} {row.original.borrower.last_name}
      </span>
    ),
  },
  {
    accessorKey: "funding_request.title",
    header: "المشروع",
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
          ? "تم التحويل"
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

interface BorrowerPaymentsProps {
  showOnlyChart?: boolean
  onExportData?: (data: BorrowerPayment[]) => void;
}

export function BorrowerPayments({ showOnlyChart = false, onExportData }: BorrowerPaymentsProps) {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["borrower-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          borrower:profiles(first_name, last_name),
          funding_request:funding_requests(title, current_funding)
        `)
        .eq("type", "borrower_payment")
        .order("created_at", { ascending: false })

      if (error) throw error
      const transformedData = data.map((payment: any) => ({
        ...payment,
        borrower: payment.borrower[0],
        funding_request: payment.funding_request[0]
      })) as BorrowerPayment[]

      if (onExportData) {
        onExportData(transformedData);
      }

      return transformedData;
    },
  })

  if (showOnlyChart) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>تحويلات المقترضين</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={payments || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}