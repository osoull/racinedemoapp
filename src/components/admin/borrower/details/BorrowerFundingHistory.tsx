import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface BorrowerFundingHistoryProps {
  borrowerId: string
}

interface FundingRequest {
  id: string
  title: string
  funding_goal: number
  status: string
  created_at: string
  current_funding: number
}

const columns: ColumnDef<FundingRequest>[] = [
  {
    accessorKey: "title",
    header: "عنوان المشروع",
  },
  {
    accessorKey: "funding_goal",
    header: "المبلغ المطلوب",
    cell: ({ row }) => (
      <span>{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(row.original.funding_goal)}</span>
    ),
  },
  {
    accessorKey: "current_funding",
    header: "المبلغ المجمع",
    cell: ({ row }) => (
      <span>{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(row.original.current_funding)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status
      const getStatusBadge = () => {
        switch (status) {
          case 'approved':
            return <Badge className="bg-green-500">معتمد</Badge>
          case 'rejected':
            return <Badge className="bg-red-500">مرفوض</Badge>
          case 'completed':
            return <Badge className="bg-blue-500">مكتمل</Badge>
          default:
            return <Badge className="bg-yellow-500">قيد المراجعة</Badge>
        }
      }
      return getStatusBadge()
    },
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الطلب",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('ar-SA'),
  },
]

export function BorrowerFundingHistory({ borrowerId }: BorrowerFundingHistoryProps) {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["borrower-funding-requests", borrowerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select("*")
        .eq("owner_id", borrowerId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as FundingRequest[]
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
        <CardTitle>طلبات التمويل</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={requests || []} 
        />
      </CardContent>
    </Card>
  )
}