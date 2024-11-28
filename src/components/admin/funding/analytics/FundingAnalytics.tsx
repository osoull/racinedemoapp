import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { PerformanceMetrics } from "./PerformanceMetrics"
import { TrendAnalysis } from "./TrendAnalysis"

export function FundingAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["funding-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_funding_request_stats')
      if (error) throw error
      return data[0]
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>مؤشرات الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceMetrics stats={stats} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تحليل الاتجاهات</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendAnalysis />
        </CardContent>
      </Card>
    </div>
  )
}