import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { formatCurrency } from "@/utils/feeCalculations"

interface TransactionFeeDetailsProps {
  feeAmount: number | null
  feeDetails?: {
    type: string
    amount: number
  }[]
}

export const TransactionFeeDetails = ({ feeAmount, feeDetails }: TransactionFeeDetailsProps) => {
  const getFeeTypeLabel = (feeType: string) => {
    switch (feeType) {
      case 'admin_fee':
        return 'رسوم إدارية'
      case 'collection_fee':
        return 'رسوم تحصيل'
      case 'basic_investor_fee':
        return 'رسوم مستثمر أساسي'
      case 'qualified_investor_fee':
        return 'رسوم مستثمر مؤهل'
      default:
        return feeType
    }
  }

  if (!feeAmount || feeAmount === 0) {
    return <span className="text-muted-foreground text-sm">لا توجد رسوم</span>
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronDown className="h-4 w-4" />
        <span>عرض التفاصيل</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        {feeDetails?.map((fee, index) => (
          <div key={index} className="flex justify-between text-xs">
            <span>{getFeeTypeLabel(fee.type)}:</span>
            <span>{formatCurrency(fee.amount)}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}