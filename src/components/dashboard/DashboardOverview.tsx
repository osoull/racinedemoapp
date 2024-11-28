import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ActivityFeed } from "./activity/ActivityFeed";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, TrendingUp, Users } from "lucide-react";
import { StatCard } from "./StatCard";

export function DashboardOverview() {
  const { toast } = useToast();
  
  const { data: platformStats, isLoading, refetch } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('calculate_platform_stats');
      if (error) throw error;
      return data?.[0] || null;
    }
  });

  // Subscribe to real-time updates
  useRealtimeSubscription(
    ['transactions', 'fee_tracking'],
    {
      onInsert: () => {
        refetch();
        toast({
          title: "تم تحديث البيانات",
          description: "تم تحديث إحصائيات المنصة"
        });
      },
      onUpdate: () => {
        refetch();
      }
    }
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={TrendingUp}
          title="إجمالي الإيرادات"
          value={`${platformStats?.total_revenue.toLocaleString()} ريال`}
          trend={{ value: platformStats?.revenue_growth || 0, isPositive: (platformStats?.revenue_growth || 0) > 0 }}
        />
        <StatCard
          icon={Users}
          title="المستثمرون النشطون"
          value={platformStats?.active_investors || 0}
          trend={{ value: platformStats?.investor_growth || 0, isPositive: true }}
        />
        <StatCard
          icon={Wallet}
          title="نسبة النمو"
          value={`${((platformStats?.revenue_growth || 0) + 100).toFixed(1)}%`}
          trend={{ value: platformStats?.revenue_growth || 0, isPositive: (platformStats?.revenue_growth || 0) > 0 }}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
        <ActivityFeed />
      </Card>
    </div>
  );
}