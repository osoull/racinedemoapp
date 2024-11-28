import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/feeCalculations";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export function InvestmentsList() {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          funding_request:funding_requests(
            title,
            funding_goal,
            current_funding,
            status
          )
        `)
        .eq("type", "investment")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!investments?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          لا توجد استثمارات حالياً
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {investments.map((investment) => (
        <Card key={investment.id} className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {investment.funding_request?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(investment.amount)}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <Progress
                  value={
                    ((investment.funding_request?.current_funding || 0) /
                      (investment.funding_request?.funding_goal || 1)) *
                    100
                  }
                  className="h-2"
                />
                <Badge
                  variant={
                    investment.status === "completed"
                      ? "success"
                      : investment.status === "pending"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {investment.status === "completed"
                    ? "مكتمل"
                    : investment.status === "pending"
                    ? "قيد المعالجة"
                    : "مرفوض"}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(investment.created_at), "dd/MM/yyyy")}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}