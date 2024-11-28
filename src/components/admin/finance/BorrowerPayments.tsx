import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/utils/feeCalculations"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

export function BorrowerPayments() {
  const { toast } = useToast()

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
      return data.map((payment: any) => ({
        ...payment,
        borrower: payment.borrower[0],
        funding_request: payment.funding_request[0]
      })) as BorrowerPayment[]
    },
  })

  // Group payments by month for the chart
  const chartData = payments?.reduce((acc: any[], payment) => {
    const month = new Date(payment.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' })
    const existingMonth = acc.find(item => item.name === month)
    
    if (existingMonth) {
      existingMonth.amount += payment.amount
      existingMonth.count += 1
    } else {
      acc.push({ name: month, amount: payment.amount, count: 1 })
    }
    
    return acc
  }, []).sort((a: any, b: any) => new Date(a.name).getTime() - new Date(b.name).getTime()) || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>تتبع المدفوعات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#0ea5e9" name="مبلغ المدفوعات" />
                <Line yAxisId="right" type="monotone" dataKey="count" stroke="#22c55e" name="عدد المدفوعات" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}