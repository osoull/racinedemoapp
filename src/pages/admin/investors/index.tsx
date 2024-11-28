import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvestorList } from "@/components/admin/investors/InvestorList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Investor } from "@/types/supabase"

export default function InvestorsPage() {
  const { data: investors, isLoading } = useQuery({
    queryKey: ["investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          investor_kyc (verification_status)
        `)
        .in("user_type", ["basic_investor", "qualified_investor"])

      if (error) throw error
      
      // Transform the data to match the expected Investor type
      const transformedData = (data || []).map(investor => ({
        ...investor,
        investor_kyc: investor.investor_kyc ? [investor.investor_kyc] : []
      }))
      
      return transformedData as Investor[]
    }
  })

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المستثمرون</h2>
          <p className="text-muted-foreground">
            إدارة وتتبع جميع المستثمرين في المنصة
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>المستثمرون</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <InvestorList investors={investors || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}