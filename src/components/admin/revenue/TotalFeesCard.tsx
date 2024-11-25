import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Wallet } from "lucide-react";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { toast } from "sonner";

export function TotalFeesCard() {
  const { data: totalFees, isLoading, refetch } = useQuery({
    queryKey: ["total-fees"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        'calculate_revenue_by_period',
        {
          start_date: new Date(0).toISOString(), // From beginning
          end_date: new Date().toISOString()
        }
      );

      if (error) throw error;
      
      // Calculate total fees from all periods
      const total = data.reduce((sum, period) => sum + period.total_fees, 0);
      return total;
    }
  });

  // Subscribe to real-time changes in transactions and fee tracking
  useRealtimeSubscription(
    ['transactions', 'fee_tracking'],
    {
      onInsert: () => {
        refetch();
        toast.info("تم تحديث إجمالي الرسوم");
      },
      onUpdate: () => {
        refetch();
        toast.info("تم تحديث إجمالي الرسوم");
      }
    }
  );

  const formatMillions = (amount: number) => {
    const millions = amount / 1000000;
    return `${millions.toFixed(1)}`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  const amount = totalFees || 0;
  const trend = { value: 4.1, isPositive: true }; // You can make this dynamic based on your needs

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-primary/10 p-3">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.value}%</span>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">إجمالي الرسوم</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{formatMillions(amount)}</h3>
          <p className="text-sm text-muted-foreground">مليون ريال</p>
        </div>
      </div>
    </Card>
  );
}