import { formatCurrency } from "@/utils/feeCalculations"
import { format } from "date-fns"

export interface FeeData {
  period: string
  admin_fees: number
  collection_fees: number
  basic_investor_fees: number
  qualified_investor_fees: number
  total_fees: number
}

interface RevenueTableProps {
  revenueData: FeeData[]
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
            <th className="text-right py-3 px-4">المجموع</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.map((fee, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">{fee.period}</td>
              <td className="py-3 px-4">{formatCurrency(fee.admin_fees)}</td>
              <td className="py-3 px-4">{formatCurrency(fee.collection_fees)}</td>
              <td className="py-3 px-4">{formatCurrency(fee.basic_investor_fees + fee.qualified_investor_fees)}</td>
              <td className="py-3 px-4 font-medium">{formatCurrency(fee.total_fees)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}