import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getFeeTypeLabel } from "@/utils/feeCalculations";

interface AdminFee {
  id: string;
  amount: number;
  fee_amount: number;
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
    accessorKey: "fee_type",
    header: "نوع الرسوم",
    cell: ({ row }) => (
      <Badge variant="outline">
        {getFeeTypeLabel(row.original.fee_type)}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "المبلغ الأساسي",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "fee_amount",
    header: "مبلغ الرسوم",
    cell: ({ row }) => formatCurrency(row.original.fee_amount),
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

interface FeesManagementProps {
  onExportData?: (data: AdminFee[]) => void;
}

export const FeesManagement = ({ onExportData }: FeesManagementProps) => {
  const { data: fees, isLoading } = useQuery({
    queryKey: ["fees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_tracking")
        .select(`
          *,
          funding_request:funding_requests(title),
          user:profiles(first_name, last_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const transformedData = (data as any[]).map(fee => ({
        ...fee,
        status: fee.status || 'pending',
        funding_request: fee.funding_request?.[0] || { title: 'N/A' },
        user: fee.user?.[0] || { first_name: 'N/A', last_name: '' }
      })) as AdminFee[];

      if (onExportData) {
        onExportData(transformedData);
      }

      return transformedData;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الرسوم</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={fees || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
