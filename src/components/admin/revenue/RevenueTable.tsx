import { formatCurrency } from "@/utils/feeCalculations";

interface RevenueData {
  period: string;
  admin_fees: number;
  collection_fees: number;
  basic_investor_fees: number;
  qualified_investor_fees: number;
  total_fees: number;
}

interface RevenueTableProps {
  revenueData: RevenueData[];
}

export function RevenueTable({ revenueData }: RevenueTableProps) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-right py-3 px-4">الفترة</th>
            <th className="text-right py-3 px-4">رسوم الإدارة</th>
            <th className="text-right py-3 px-4">رسوم التحصيل</th>
            <th className="text-right py-3 px-4">رسوم المستثمرين</th>
            <th className="text-right py-3 px-4">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.map((row) => (
            <tr key={row.period} className="border-b">
              <td className="py-3 px-4">{row.period}</td>
              <td className="py-3 px-4">{formatCurrency(row.admin_fees)}</td>
              <td className="py-3 px-4">{formatCurrency(row.collection_fees)}</td>
              <td className="py-3 px-4">
                {formatCurrency(row.basic_investor_fees + row.qualified_investor_fees)}
              </td>
              <td className="py-3 px-4 font-medium">{formatCurrency(row.total_fees)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}