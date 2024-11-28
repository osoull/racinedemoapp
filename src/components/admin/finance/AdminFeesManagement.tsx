import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/feeCalculations";

interface AdminFee {
  id: string;
  amount: number;
  fee_type: string;
  status: string;
  created_at: string;
  funding_request: {
    title: string;
  };
  user: {
    first_name: string;
    last_name: string;
  };
}

const columns: ColumnDef<AdminFee>[] = [
  {
    accessorKey: "id",
    header: "رقم المعاملة",
    cell: ({ row }) => <span className="font-mono">{row.original.id.slice(0, 8)}...</span>,
  },
  {
    accessorKey: "user",
    header: "المستخدم",
    cell: ({ row }) => (
      <span>
        {row.original.user.first_name} {row.original.user.last_name}
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
];

export function AdminFeesManagement() {
  const { data: adminFees, isLoading } = useQuery({
    queryKey: ["admin-fees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_tracking")
        .select(`
          *,
          funding_request:funding_requests(title),
          user:profiles(first_name, last_name)
        `)
        .eq("fee_type", "admin_fee")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AdminFee[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الرسوم الإدارية</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={adminFees || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}