import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { KYCVerificationList } from "./KYCVerificationList"

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

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
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
      </div>
    </DashboardLayout>
  )
}