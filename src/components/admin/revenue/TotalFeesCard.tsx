import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRevenueStats } from "@/hooks/useRevenueStats"
import { Loader2 } from "lucide-react"

export function TotalFeesCard() {
  const { data, isLoading } = useRevenueStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إجمالي الرسوم</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {data?.totalRevenue.toLocaleString()} ريال
        </div>
        <p className="text-xs text-muted-foreground">
          {data?.monthlyGrowth > 0 ? "+" : ""}{data?.monthlyGrowth.toFixed(1)}% منذ الشهر الماضي
        </p>
      </CardContent>
    </Card>
  )
}