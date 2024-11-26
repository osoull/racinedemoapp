import { formatCurrency } from "@/utils/feeCalculations"
import { format } from "date-fns"

interface FeeData {
  id: string
  fee_type: string
  fee_amount: number
  transaction: {
    created_at: string
  } | null
}

interface RevenueTableProps {
  revenueData: FeeData[]
}

export function RevenueTable({ revenueData }: RevenueTableProps) {
  const formatFeeType = (type: string) => {
    switch (type) {
      case 'admin_fee':
        return 'عمولة إدارية'
      case 'collection_fee':
        return 'عمولة تحصيل'
      case 'basic_investor_fee':
        return 'عمولة مستثمر أساسي'
      case 'qualified_investor_fee':
        return 'عمولة مستثمر مؤهل'
      default:
        return type
    }
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-right py-3 px-4">التاريخ</th>
            <th className="text-right py-3 px-4">نوع العمولة</th>
            <th className="text-right py-3 px-4">المبلغ</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.map((fee) => (
            <tr key={fee.id} className="border-b">
              <td className="py-3 px-4">
                {fee.transaction?.created_at ? 
                  format(new Date(fee.transaction.created_at), 'yyyy-MM-dd') : 
                  'غير متوفر'
                }
              </td>
              <td className="py-3 px-4">{formatFeeType(fee.fee_type)}</td>
              <td className="py-3 px-4 font-medium">{formatCurrency(fee.fee_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}