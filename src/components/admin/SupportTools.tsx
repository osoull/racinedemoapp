import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportTools() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الدعم الفني</h2>
          <p className="text-muted-foreground">
            إدارة طلبات الدعم والمساعدة
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>طلبات الدعم</CardTitle>
          </CardHeader>
          <CardContent>
            <p>قريباً...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
