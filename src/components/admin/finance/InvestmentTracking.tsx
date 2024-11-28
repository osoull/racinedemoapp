import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/feeCalculations";

interface Investment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  investor: {
    first_name: string;
    last_name: string;
  };
  funding_request: {
    title: string;
  };
}

const columns: ColumnDef<Investment>[] = [
  {
    accessorKey: "investor",
    header: "المستثمر",
    cell: ({ row }) => (
      <span>
        {row.original.investor.first_name} {row.original.investor.last_name}
      </span>
    ),
  },
  {
    accessorKey: "funding_request.title",
    header: "المشروع",
  },
  {
    accessorKey: "amount",
    header: "مبلغ الاستثمار",
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
    header: "تاريخ الاستثمار",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("ar-SA"),
  },
];

export function InvestmentTracking() {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          investor:profiles(first_name, last_name),
          funding_request:funding_requests(title)
        `)
        .eq("type", "investment")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Investment[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>متابعة الاستثمارات</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={investments || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}