import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/utils/feeCalculations";

interface FinancialReport {
  period: string;
  total_investments: number;
  total_fees: number;
  total_borrower_payments: number;
  active_opportunities: number;
  admin_fees: number;
  collection_fees: number;
  basic_investor_fees: number;
  qualified_investor_fees: number;
}

const columns: ColumnDef<FinancialReport>[] = [
  {
    accessorKey: "period",
    header: "الفترة",
  },
  {
    accessorKey: "total_investments",
    header: "إجمالي الاستثمارات",
    cell: ({ row }) => formatCurrency(row.original.total_investments),
  },
  {
    accessorKey: "total_fees",
    header: "إجمالي الرسوم",
    cell: ({ row }) => formatCurrency(row.original.total_fees),
  },
  {
    accessorKey: "total_borrower_payments",
    header: "إجمالي المدفوعات للمقترضين",
    cell: ({ row }) => formatCurrency(row.original.total_borrower_payments),
  },
  {
    accessorKey: "active_opportunities",
    header: "الفرص النشطة",
  },
];

interface FinancialReportsProps {
  onExportData?: (data: FinancialReport[]) => void;
}

export function FinancialReports({ onExportData }: FinancialReportsProps) {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["financial-reports"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_revenue_by_period", {
        start_date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
        end_date: new Date().toISOString(),
      });

      if (error) throw error;

      const transformedData = (data as any[]).map(report => ({
        ...report,
        total_fees: report.admin_fees + report.collection_fees + 
                   report.basic_investor_fees + report.qualified_investor_fees
      })) as FinancialReport[];

      if (onExportData) {
        onExportData(transformedData);
      }

      return transformedData;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>التقارير المالية</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={reports || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
