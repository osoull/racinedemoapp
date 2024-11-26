import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subMonths, startOfYear, endOfYear } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RevenueTable } from "./RevenueTable";
import type { FeeData } from "./RevenueTable";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export function RevenueDetails() {
  const [timeframe, setTimeframe] = useState<"year" | "last12">("year");
  
  const { data: revenueData, isLoading, refetch } = useQuery<FeeData[]>({
    queryKey: ["revenue", timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fee_tracking')
        .select(`
          *,
          transaction:transaction_id (
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  useRealtimeSubscription(
    'fee_tracking',
    {
      onInsert: () => {
        refetch();
        toast.info("تم تحديث بيانات الإيرادات");
      },
      onUpdate: () => {
        refetch();
        toast.info("تم تحديث بيانات الإيرادات");
      }
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentPeriodData = {
    admin_fees: revenueData?.filter(fee => fee.fee_type === 'admin_fee')
      .reduce((sum, fee) => sum + fee.fee_amount, 0) || 0,
    collection_fees: revenueData?.filter(fee => fee.fee_type === 'collection_fee')
      .reduce((sum, fee) => sum + fee.fee_amount, 0) || 0,
    investor_fees: revenueData?.filter(fee => 
      fee.fee_type === 'basic_investor_fee' || fee.fee_type === 'qualified_investor_fee'
    ).reduce((sum, fee) => sum + fee.fee_amount, 0) || 0
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الإيرادات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger
                value="year"
                onClick={() => setTimeframe("year")}
                className={timeframe === "year" ? "bg-primary" : ""}
              >
                السنة الحالية
              </TabsTrigger>
              <TabsTrigger
                value="last12"
                onClick={() => setTimeframe("last12")}
                className={timeframe === "last12" ? "bg-primary" : ""}
              >
                آخر 12 شهر
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">رسوم الإدارة</p>
              <p className="text-2xl font-bold">{currentPeriodData.admin_fees.toLocaleString('ar-SA')} ريال</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">رسوم التحصيل</p>
              <p className="text-2xl font-bold">{currentPeriodData.collection_fees.toLocaleString('ar-SA')} ريال</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">رسوم المستثمرين</p>
              <p className="text-2xl font-bold">{currentPeriodData.investor_fees.toLocaleString('ar-SA')} ريال</p>
            </Card>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h3 className="font-semibold mb-4">التفاصيل</h3>
              <RevenueTable revenueData={revenueData || []} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}