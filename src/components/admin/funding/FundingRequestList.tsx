import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/feeCalculations"

interface FundingRequest {
  id: string
  title: string
  owner: {
    first_name: string
    last_name: string
  }
  funding_goal: number
  current_funding: number
  status: string
  created_at: string
  category: string
}

const columns: ColumnDef<FundingRequest>[] = [
  {
    accessorKey: "title",
    header: "عنوان المشروع",
  },
  {
    accessorKey: "owner",
    header: "المقترض",
    cell: ({ row }) => (
      <span>
        {row.original.owner.first_name} {row.original.owner.last_name}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "الفئة",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "funding_goal",
    header: "هدف التمويل",
    cell: ({ row }) => formatCurrency(row.original.funding_goal),
  },
  {
    accessorKey: "current_funding",
    header: "التمويل الحالي",
    cell: ({ row }) => formatCurrency(row.original.current_funding),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "approved"
            ? "default"
            : row.original.status === "pending"
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.status === "approved"
          ? "معتمد"
          : row.original.status === "pending"
          ? "قيد المراجعة"
          : "مرفوض"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("ar-SA"),
  },
]

export function FundingRequestList() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["funding-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          *,
          owner:profiles(first_name, last_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <DataTable
      columns={columns}
      data={requests || []}
      isLoading={isLoading}
    />
  )
}