import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { RevenueDetails } from "./RevenueDetails"
import { Toaster } from "sonner"

export function RevenueTracking() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">تتبع الإيرادات</h2>
          <p className="text-muted-foreground">
            متابعة وتحليل إيرادات المنصة من العمولات والرسوم
          </p>
        </div>

        <RevenueDetails />

        <Card className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              سيتم إضافة الرسم البياني قريباً
            </p>
          </div>
        </Card>
      </div>
      <Toaster />
    </DashboardLayout>
  )
}