import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { KYCVerificationList } from "./KYCVerificationList"
import { KYCStatusHistory } from "./KYCStatusHistory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function KYCManagement() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة KYC</h2>
          <p className="text-muted-foreground">
            إدارة عمليات التحقق من الهوية والامتثال
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات KYC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">طلبات قيد المراجعة</p>
                  <p className="text-2xl font-bold">
                    <KYCStats status="pending" />
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">طلبات معتمدة</p>
                  <p className="text-2xl font-bold text-green-600">
                    <KYCStats status="approved" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>آخر التحديثات</CardTitle>
            </CardHeader>
            <CardContent>
              <KYCStatusHistory />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
                <TabsTrigger value="approved">معتمد</TabsTrigger>
                <TabsTrigger value="rejected">مرفوض</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <KYCVerificationList status="pending" />
              </TabsContent>

              <TabsContent value="approved">
                <KYCVerificationList status="approved" />
              </TabsContent>

              <TabsContent value="rejected">
                <KYCVerificationList status="rejected" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function KYCStats({ status }: { status: string }) {
  const { data } = useQuery({
    queryKey: ['kyc-stats', status],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_status', status)
      
      return count || 0
    }
  })

  return data || 0
}