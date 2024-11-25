import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PlatformSettings() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إعدادات المنصة</h2>
          <p className="text-muted-foreground">
            إدارة إعدادات وتكوين المنصة
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>الإعدادات العامة</CardTitle>
          </CardHeader>
          <CardContent>
            <p>قريباً...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
