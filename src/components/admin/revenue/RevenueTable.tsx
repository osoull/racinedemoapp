import { formatCurrency } from "@/utils/feeCalculations"
import { format } from "date-fns"

export interface FeeData {
  id: string
  transaction_id: string
  fee_type: string
  fee_amount: number
  amount: number
  created_at: string
  transaction?: {
    created_at: string
  }
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
            <th className="text-right py-3 px-4">التاريخ</th>
            <th className="text-right py-3 px-4">نوع العمولة</th>
            <th className="text-right py-3 px-4">المبلغ الأساسي</th>
            <th className="text-right py-3 px-4">مبلغ العمولة</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.map((fee) => (
            <tr key={fee.id} className="border-b">
              <td className="py-3 px-4">
                {format(new Date(fee.created_at), 'yyyy-MM-dd')}
              </td>
              <td className="py-3 px-4">
                {fee.fee_type === 'admin_fee' && 'عمولة الإدارة'}
                {fee.fee_type === 'collection_fee' && 'عمولة التحصيل'}
                {fee.fee_type === 'basic_investor_fee' && 'عمولة المستثمر الأساسي'}
                {fee.fee_type === 'qualified_investor_fee' && 'عمولة المستثمر المؤهل'}
              </td>
              <td className="py-3 px-4">{formatCurrency(fee.amount)}</td>
              <td className="py-3 px-4 font-medium">{formatCurrency(fee.fee_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}