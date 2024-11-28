import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardStats } from "./stats/DashboardStats"
import { ProjectsDistributionChart } from "./charts/ProjectsDistributionChart"
import { PendingActionsAlert } from "./alerts/PendingActionsAlert"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardOverview() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Souscription aux mises à jour en temps réel
  useRealtimeSubscription(
    ["funding_requests", "transactions", "funding_request_documents"],
    {
      onInsert: () => {
        queryClient.invalidateQueries({ queryKey: ["funding-stats"] })
        queryClient.invalidateQueries({ queryKey: ["pending-actions"] })
        toast({
          title: "تحديث البيانات",
          description: "تم تحديث البيانات في لوحة التحكم"
        })
      },
      onUpdate: () => {
        queryClient.invalidateQueries({ queryKey: ["funding-stats"] })
        queryClient.invalidateQueries({ queryKey: ["pending-actions"] })
      }
    }
  )

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          نظرة عامة على أداء المنصة والإحصائيات
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectsDistributionChart />
        <PendingActionsAlert />
      </div>
    </DashboardLayout>
  )
}
