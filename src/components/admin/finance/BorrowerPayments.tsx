import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/utils/feeCalculations";

interface BorrowerPayment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  borrower: {
    first_name: string;
    last_name: string;
  };
  funding_request: {
    title: string;
    current_funding: number;
  };
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
];

export function BorrowerPayments() {
  const { toast } = useToast();

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
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match the BorrowerPayment interface
      return (data as any[]).map(payment => ({
        ...payment,
        borrower: payment.borrower?.[0] || { first_name: 'N/A', last_name: '' },
        funding_request: payment.funding_request?.[0] || { title: 'N/A', current_funding: 0 }
      })) as BorrowerPayment[];
    },
  });

  const handleTransferApproval = async (paymentId: string) => {
    const { error } = await supabase
      .from("transactions")
      .update({ status: "completed" })
      .eq("id", paymentId);

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة التحويل",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة التحويل بنجاح",
      });
    }
  };

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
  );
}