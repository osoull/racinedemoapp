import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { FundingStats } from "./FundingStats"
import { FundingChart } from "./FundingChart"
import { CategoryDistribution } from "./CategoryDistribution"
import { FundingStats as FundingStatsType } from "@/types/funding"

export function FundingOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["funding-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_funding_request_stats')
      if (error) throw error
      
      // Convert the JSONB response to the correct type
      const formattedData = {
        ...data[0],
        requests_by_category: data[0].requests_by_category ? 
          JSON.parse(JSON.stringify(data[0].requests_by_category)) : {},
        requests_by_status: data[0].requests_by_status ?
          JSON.parse(JSON.stringify(data[0].requests_by_status)) : {}
      } as FundingStatsType
      
      return formattedData
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <FundingStats stats={stats} />
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>تطور طلبات التمويل</CardTitle>
        </CardHeader>
        <CardContent>
          <FundingChart />
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>توزيع الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryDistribution data={stats?.requests_by_category} />
        </CardContent>
      </Card>
    </div>
  )
}