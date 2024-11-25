import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

        <Card>
          <CardHeader>
            <CardTitle>طلبات التحقق</CardTitle>
          </CardHeader>
          <CardContent>
            <p>قريباً...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
