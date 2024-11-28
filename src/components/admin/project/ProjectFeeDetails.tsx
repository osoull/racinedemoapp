import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/utils/feeCalculations"

interface ProjectFeeDetailsProps {
  amount: number
}

export function ProjectFeeDetails({ amount }: ProjectFeeDetailsProps) {
  const adminFee = amount * 0.02 // 2% admin fee
  const platformFee = amount * 0.01 // 1% platform fee
  const totalFees = adminFee + platformFee

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-between">
          <span>المبلغ الأساسي</span>
          <span className="font-medium">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>رسوم الإدارة (2%)</span>
          <span>{formatCurrency(adminFee)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>رسوم المنصة (1%)</span>
          <span>{formatCurrency(platformFee)}</span>
        </div>
        <div className="flex justify-between font-medium pt-4 border-t">
          <span>الإجمالي مع الرسوم</span>
          <span>{formatCurrency(amount + totalFees)}</span>
        </div>
      </CardContent>
    </Card>
  )
}