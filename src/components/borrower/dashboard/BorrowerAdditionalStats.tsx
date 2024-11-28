import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle, Wallet } from "lucide-react"
import { BorrowerStats } from "@/hooks/useBorrowerStats"
import { formatCurrency } from "@/utils/feeCalculations"

interface BorrowerAdditionalStatsProps {
  stats: BorrowerStats
}

export function BorrowerAdditionalStats({ stats }: BorrowerAdditionalStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            متوسط وقت الموافقة
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.average_funding_time || "لا يوجد بيانات"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            المدفوعات المعلقة
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.pending_payments || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            إجمالي الرسوم المدفوعة
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats?.total_fees_paid || 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}