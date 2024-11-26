import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RevenueTable } from "./RevenueTable";
import type { RevenueStats, FeeData } from "@/types/revenue";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export function RevenueDetails() {
  const [timeframe, setTimeframe] = useState<"year" | "last12">("year");
  
  const { data: revenueData, isLoading, refetch } = useQuery<RevenueStats>({
    queryKey: ["revenue", timeframe],
    queryFn: async () => {
      const now = new Date();
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

      // Get current period fees
      const { data: currentFees, error: currentError } = await supabase
        .from('fee_tracking')
        .select(`
          *,
          transaction:transactions!inner(
            created_at
          )
        `)
        .gte('created_at', lastYear.toISOString())
        .order('created_at', { ascending: false });

      if (currentError) throw currentError;

      // Get last year's total for comparison
      const { data: lastYearData, error: lastYearError } = await supabase
        .from('fee_tracking')
        .select('fee_amount')
        .lt('created_at', lastYear.toISOString())
        .gte('created_at', new Date(lastYear.getFullYear() - 1, lastYear.getMonth(), lastYear.getDate()).toISOString());

      if (lastYearError) throw lastYearError;

      const currentTotal = currentFees.reduce((sum, fee) => sum + (fee.fee_amount || 0), 0);
      const lastYearTotal = lastYearData.reduce((sum, fee) => sum + (fee.fee_amount || 0), 0);
      
      // Calculate yearly change percentage
      const yearlyChange = lastYearTotal === 0 
        ? 100 
        : ((currentTotal - lastYearTotal) / lastYearTotal) * 100;

      // Transform the data to match FeeData type
      const transformedFees: FeeData[] = currentFees.map(fee => ({
        ...fee,
        transaction: {
          created_at: fee.transaction?.created_at || new Date().toISOString()
        }
      }));

      return {
        currentTotal,
        lastYearTotal,
        yearlyChange,
        fees: transformedFees
      };
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

  if (!revenueData) {
    return null;
  }

  const currentPeriodData = {
    admin_fees: revenueData.fees
      .filter(fee => fee.fee_type === 'admin_fee')
      .reduce((sum, fee) => sum + fee.fee_amount, 0),
    collection_fees: revenueData.fees
      .filter(fee => fee.fee_type === 'collection_fee')
      .reduce((sum, fee) => sum + fee.fee_amount, 0),
    investor_fees: revenueData.fees
      .filter(fee => 
        fee.fee_type === 'basic_investor_fee' || fee.fee_type === 'qualified_investor_fee'
      ).reduce((sum, fee) => sum + fee.fee_amount, 0)
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الإيرادات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold mt-2">
                    {(revenueData.currentTotal / 1000000).toFixed(1)} مليون ريال
                  </p>
                </div>
                <div className={`text-sm font-medium ${revenueData.yearlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueData.yearlyChange >= 0 ? '↑' : '↓'} {Math.abs(revenueData.yearlyChange).toFixed(1)}%
                </div>
              </div>
            </Card>
          </div>

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
              <RevenueTable revenueData={revenueData.fees} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}