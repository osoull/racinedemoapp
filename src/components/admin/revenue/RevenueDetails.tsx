import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subMonths, startOfYear, endOfYear } from "date-fns";
import { ar } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to changes in transactions and commissions tables
    const transactionsChannel = supabase
      .channel('revenue_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ["revenue", timeframe] });
          toast.info("تم تحديث بيانات الإيرادات");
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'commissions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ["revenue", timeframe] });
          toast.info("تم تحديث معدلات العمولات");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
    };
  }, [timeframe, queryClient]);

  const { data: revenueData, isLoading } = useQuery({
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
      return data as RevenueData[];
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const calculateTotals = (data: RevenueData[] | undefined) => {
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

  const totals = calculateTotals(revenueData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">رسوم الإدارة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totals.admin_fees)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">رسوم التحصيل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totals.collection_fees)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">رسوم المستثمرين الأساسيين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totals.basic_investor_fees)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">رسوم المستثمرين المؤهلين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totals.qualified_investor_fees)}</div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{formatCurrency(totals.total_fees)}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium bg-muted">
                <div>الفترة</div>
                <div>رسوم الإدارة</div>
                <div>رسوم التحصيل</div>
                <div>رسوم المستثمرين الأساسيين</div>
                <div>رسوم المستثمرين المؤهلين</div>
                <div>الإجمالي</div>
              </div>
              <div className="divide-y">
                {revenueData?.map((row) => (
                  <div key={row.period} className="grid grid-cols-6 gap-4 p-4">
                    <div>{row.period}</div>
                    <div>{formatCurrency(row.admin_fees)}</div>
                    <div>{formatCurrency(row.collection_fees)}</div>
                    <div>{formatCurrency(row.basic_investor_fees)}</div>
                    <div>{formatCurrency(row.qualified_investor_fees)}</div>
                    <div className="font-medium">{formatCurrency(row.total_fees)}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}