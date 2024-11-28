import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface BorrowerFinancialsProps {
  borrowerId: string
}

interface Transaction {
  id: string
  amount: number
  type: string
  status: string
  created_at: string
  fee_amount: number
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "نوع المعاملة",
    cell: ({ row }) => {
      const type = row.original.type
      return type === 'payment' ? 'دفع' : 'سحب'
    },
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => (
      <span>{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "fee_amount",
    header: "الرسوم",
    cell: ({ row }) => (
      <span>{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(row.original.fee_amount)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status
      const getStatusBadge = () => {
        switch (status) {
          case 'completed':
            return <Badge className="bg-green-500">مكتمل</Badge>
          case 'pending':
            return <Badge className="bg-yellow-500">قيد المعالجة</Badge>
          case 'failed':
            return <Badge className="bg-red-500">فشل</Badge>
          default:
            return <Badge>{status}</Badge>
        }
      }
      return getStatusBadge()
    },
  },
  {
    accessorKey: "created_at",
    header: "التاريخ",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('ar-SA'),
  },
]

export function BorrowerFinancials({ borrowerId }: BorrowerFinancialsProps) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["borrower-transactions", borrowerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", borrowerId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Transaction[]
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>المعاملات المالية</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={transactions || []} 
        />
      </CardContent>
    </Card>
  )
}