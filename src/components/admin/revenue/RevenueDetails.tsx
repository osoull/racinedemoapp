import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subMonths, startOfYear, endOfYear } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RevenueTable } from "./RevenueTable";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface RevenueData {
  period: string;
  admin_fees: number;
  collection_fees: number;
  basic_investor_fees: number;
  qualified_investor_fees: number;
  total_fees: number;
}

export function RevenueDetails() {
  const [timeframe, setTimeframe] = useState<"year" | "last12">("year");
  
  const { data: revenueData, isLoading, refetch } = useQuery<RevenueData[]>({
    queryKey: ["revenue", timeframe],
    queryFn: async () => {
      let startDate, endDate;
      
      if (timeframe === "year") {
        startDate = startOfYear(new Date());
        endDate = endOfYear(new Date());
      } else {
        startDate = subMonths(new Date(), 12);
        endDate = new Date();
      }

      const { data, error } = await supabase
        .from('fee_tracking')
        .select(`
          created_at,
          fee_type,
          fee_amount
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group fees by month
      const monthlyData = data.reduce((acc: { [key: string]: RevenueData }, fee) => {
        const month = format(new Date(fee.created_at), 'yyyy-MM');
        
        if (!acc[month]) {
          acc[month] = {
            period: month,
            admin_fees: 0,
            collection_fees: 0,
            basic_investor_fees: 0,
            qualified_investor_fees: 0,
            total_fees: 0
          };
        }

        switch (fee.fee_type) {
          case 'admin_fee':
            acc[month].admin_fees += fee.fee_amount;
            break;
          case 'collection_fee':
            acc[month].collection_fees += fee.fee_amount;
            break;
          case 'basic_investor_fee':
            acc[month].basic_investor_fees += fee.fee_amount;
            break;
          case 'qualified_investor_fee':
            acc[month].qualified_investor_fees += fee.fee_amount;
            break;
        }

        acc[month].total_fees += fee.fee_amount;
        return acc;
      }, {});

      return Object.values(monthlyData);
    }
  });

  // Subscribe to real-time changes in fee_tracking
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

  const currentPeriodData = revenueData?.[0] || {
    admin_fees: 0,
    collection_fees: 0,
    basic_investor_fees: 0,
    qualified_investor_fees: 0,
    total_fees: 0
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
              <p className="text-2xl font-bold">
                {(currentPeriodData.basic_investor_fees + currentPeriodData.qualified_investor_fees).toLocaleString('ar-SA')} ريال
              </p>
            </Card>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h3 className="font-semibold mb-4">التفاصيل الشهرية</h3>
              <RevenueTable revenueData={revenueData || []} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}