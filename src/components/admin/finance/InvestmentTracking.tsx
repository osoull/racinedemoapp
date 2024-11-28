import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/feeCalculations";
import { Investment } from "@/types/investment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const columns: ColumnDef<Investment>[] = [
  {
    accessorKey: "user",
    header: "المستثمر",
    cell: ({ row }) => (
      <span>
        {row.original.user?.first_name} {row.original.user?.last_name}
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

interface InvestmentTrackingProps {
  showOnlyChart?: boolean;
  onExportData?: (data: Investment[]) => void;
}

export function InvestmentTracking({ showOnlyChart = false, onExportData }: InvestmentTrackingProps) {
  const [groupBy, setGroupBy] = useState<"none" | "project" | "investor">("none");

  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:profiles(first_name, last_name),
          investment:investments(
            amount,
            project:projects(title)
          )
        `)
        .eq("type", "investment")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedData = data.map((investment: any) => ({
        ...investment,
        user: investment.user[0],
        investment: investment.investment[0]
      })) as Investment[];

      if (onExportData) {
        onExportData(transformedData);
      }

      return transformedData;
    },
  });

  const groupedData = () => {
    if (!investments || groupBy === "none") return investments;

    const grouped = investments.reduce((acc: { [key: string]: Investment[] }, investment) => {
      const key = groupBy === "project" 
        ? investment.funding_request.title 
        : `${investment.user?.first_name} ${investment.user?.last_name}`;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(investment);
      return acc;
    }, {});

    return Object.values(grouped).flat();
  };

  if (showOnlyChart) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>قائمة الاستثمارات</CardTitle>
          <Select dir="rtl" value={groupBy} onValueChange={(value: "none" | "project" | "investor") => setGroupBy(value)}>
            <SelectTrigger className="w-[200px] text-right">
              <SelectValue placeholder="تجميع حسب..." />
            </SelectTrigger>
            <SelectContent className="text-right">
              <SelectItem value="none">بدون تجميع</SelectItem>
              <SelectItem value="project">تجميع حسب المشروع</SelectItem>
              <SelectItem value="investor">تجميع حسب المستثمر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={groupedData() || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}