import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TransactionManagement() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المعاملات</h2>
          <p className="text-muted-foreground">
            مراقبة وإدارة المعاملات المالية
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>المعاملات الحالية</CardTitle>
          </CardHeader>
          <CardContent>
            <p>قريباً...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
