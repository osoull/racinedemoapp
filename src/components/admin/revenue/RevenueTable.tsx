import { formatCurrency } from "@/utils/feeCalculations";

interface RevenueTableProps {
  revenueData: Array<{
    period: string;
    admin_fees: number;
    collection_fees: number;
    basic_investor_fees: number;
    qualified_investor_fees: number;
    total_fees: number;
  }>;
}

export function RevenueTable({ revenueData }: RevenueTableProps) {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-6 gap-4 p-4 font-medium bg-muted">
        <div>الفترة</div>
        <div>رسوم الإدارة</div>
        <div>رسوم التحصيل</div>
        <div>رسوم المستثمرين الأساسيين</div>
        <div>رسوم المستثمرين المؤهلين</div>
        <div>الإجمالي</div>
      </div>
      <div className="divide-y">
        {revenueData?.map((row) => (
          <div key={row.period} className="grid grid-cols-6 gap-4 p-4">
            <div>{row.period}</div>
            <div>{formatCurrency(row.admin_fees)}</div>
            <div>{formatCurrency(row.collection_fees)}</div>
            <div>{formatCurrency(row.basic_investor_fees)}</div>
            <div>{formatCurrency(row.qualified_investor_fees)}</div>
            <div className="font-medium">{formatCurrency(row.total_fees)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}