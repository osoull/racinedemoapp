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
      </div>
      <Toaster />
    </DashboardLayout>
  )
}