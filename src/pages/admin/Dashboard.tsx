import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, TrendingUp, Users, Wallet } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed"

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_platform_stats");
      if (error) throw error;
      return data[0];
    },
  });

  const { data: fundingStats, isLoading: isLoadingFunding } = useQuery({
    queryKey: ["funding-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_funding_request_stats");
      if (error) throw error;
      return data[0];
    },
  });

  if (isLoading || isLoadingFunding) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
          <p className="text-muted-foreground">
            نظرة عامة على أداء المنصة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={TrendingUp}
            title="إجمالي التمويل"
            value={fundingStats?.total_amount_approved || 0}
            trend={12.5}
            showAsCurrency
          />
          <StatCard
            icon={Users}
            title="المستثمرون النشطون"
            value={stats?.active_investors || 0}
            trend={stats?.investor_growth || 0}
          />
          <StatCard
            icon={Wallet}
            title="الإيرادات"
            value={stats?.total_revenue || 0}
            trend={stats?.revenue_growth || 0}
            showAsCurrency
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">طلبات التمويل</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الطلبات النشطة</p>
                  <p className="text-2xl font-semibold">{fundingStats?.approved_requests || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">قيد المراجعة</p>
                  <p className="text-2xl font-semibold">{fundingStats?.pending_requests || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
            <ActivityFeed />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}