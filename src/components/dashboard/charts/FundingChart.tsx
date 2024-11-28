import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/feeCalculations";

export function FundingChart() {
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("type", "investment")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group transactions by month
      const monthlyData = data.reduce((acc: any[], transaction) => {
        const month = new Date(transaction.created_at).toLocaleString("default", {
          month: "short",
        });
        const existingMonth = acc.find((item) => item.month === month);

        if (existingMonth) {
          existingMonth.amount += transaction.amount;
          existingMonth.count += 1;
        } else {
          acc.push({
            month,
            amount: transaction.amount,
            count: 1,
          });
        }

        return acc;
      }, []);

      return monthlyData;
    },
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["funding_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select("*")
        .eq("status", "active");

      if (error) throw error;

      return data.map((project) => ({
        title: project.title,
        current: project.current_funding || 0,
        goal: project.funding_goal,
        progress: ((project.current_funding || 0) / project.funding_goal) * 100,
      }));
    },
  });

  if (isLoadingTransactions || isLoadingProjects) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>حجم التمويل الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("ar-SA", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `شهر ${label}`}
                />
                <Bar dataKey="amount" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تقدم المشاريع النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projects}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="title" width={100} />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  labelFormatter={(label) => `المشروع: ${label}`}
                />
                <Bar dataKey="progress" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}