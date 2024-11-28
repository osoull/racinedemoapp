import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: number
  showAsCurrency?: boolean
}

export function StatCard({ title, value, icon: Icon, trend, showAsCurrency }: StatCardProps) {
  const formattedValue = showAsCurrency 
    ? new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value)
    : value.toLocaleString('ar-SA')

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend !== undefined && (
          <p className={cn(
            "text-xs",
            trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"
          )}>
            {trend > 0 ? "+" : ""}{trend}% منذ الشهر الماضي
          </p>
        )}
      </CardContent>
    </Card>
  )
}