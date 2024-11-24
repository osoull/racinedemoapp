import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvestorList } from "@/components/admin/investors/InvestorList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function InvestorsPage() {
  const { data: investors, isLoading } = useQuery({
    queryKey: ["investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          investor_kyc (*)
        `)
        .eq("user_type", "investor")

      if (error) throw error
      return data
    }
  })

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المستثمرين</h2>
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
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="all">جميع المستثمرين</TabsTrigger>
                  <TabsTrigger value="basic">المستثمرون الأساسيون</TabsTrigger>
                  <TabsTrigger value="qualified">المستثمرون المؤهلون</TabsTrigger>
                </TabsList>
                <InvestorList investors={investors || []} />
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}