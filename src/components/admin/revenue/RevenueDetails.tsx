import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subMonths, startOfYear, endOfYear } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RevenueSummary } from "./RevenueSummary";
import { RevenueTable } from "./RevenueTable";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { TotalFeesCard } from "./TotalFeesCard";

export function RevenueDetails() {
  const [timeframe, setTimeframe] = useState<"year" | "last12">("year");
  
  const { data: revenueData, isLoading, refetch } = useQuery({
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

      const { data, error } = await supabase.rpc(
        'calculate_revenue_by_period',
        {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }
      );

      if (error) throw error;
      return data;
    }
  });

  // Subscribe to real-time changes in transactions and fee tracking
  useRealtimeSubscription(
    ['transactions', 'fee_tracking'],
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

  const totals = calculateTotals(revenueData);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-full">
          <TotalFeesCard />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الإيرادات</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">ملخص</TabsTrigger>
              <TabsTrigger value="monthly">تفاصيل شهرية</TabsTrigger>
            </TabsList>

            <div className="mb-4">
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

            <TabsContent value="summary">
              <RevenueSummary totals={totals} />
            </TabsContent>

            <TabsContent value="monthly">
              <RevenueTable revenueData={revenueData || []} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const calculateTotals = (data: any[] | null) => {
  if (!data) return {
    admin_fees: 0,
    collection_fees: 0,
    basic_investor_fees: 0,
    qualified_investor_fees: 0,
    total_fees: 0
  };

  return data.reduce((acc, curr) => ({
    admin_fees: acc.admin_fees + curr.admin_fees,
    collection_fees: acc.collection_fees + curr.collection_fees,
    basic_investor_fees: acc.basic_investor_fees + curr.basic_investor_fees,
    qualified_investor_fees: acc.qualified_investor_fees + curr.qualified_investor_fees,
    total_fees: acc.total_fees + curr.total_fees
  }), {
    admin_fees: 0,
    collection_fees: 0,
    basic_investor_fees: 0,
    qualified_investor_fees: 0,
    total_fees: 0
  });
};