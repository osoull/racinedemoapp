import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

type InvestmentOpportunity = {
  id: string;
  status: string;
  total_invested: number;
  start_date: string;
  funding_request: {
    title: string;
    description: string;
    funding_goal: number;
    current_funding: number;
    owner: {
      first_name: string;
      last_name: string;
      company_name: string;
    };
  };
};

export function InvestmentOpportunities() {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["investment-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_opportunities")
        .select(`
          *,
          funding_request:funding_requests (
            title,
            description,
            funding_goal,
            current_funding,
            owner:profiles (
              first_name,
              last_name,
              company_name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InvestmentOpportunity[];
    },
  });

  const columns = [
    {
      accessorKey: "funding_request.title",
      header: "عنوان المشروع",
    },
    {
      accessorKey: "funding_request.owner",
      header: "المقترض",
      cell: ({ row }) => {
        const owner = row.original.funding_request.owner;
        return owner.company_name || `${owner.first_name} ${owner.last_name}`;
      },
    },
    {
      accessorKey: "funding_request.funding_goal",
      header: "الهدف",
      cell: ({ row }) => (
        <span>{row.original.funding_request.funding_goal.toLocaleString()} ريال</span>
      ),
    },
    {
      accessorKey: "funding_request.current_funding",
      header: "التمويل الحالي",
      cell: ({ row }) => {
        const { current_funding, funding_goal } = row.original.funding_request;
        const progress = (current_funding / funding_goal) * 100;
        
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{current_funding.toLocaleString()} ريال</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
          {row.original.status === "active" ? "نشط" : "مغلق"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">فرص الاستثمار</h2>
        <p className="text-muted-foreground">
          إدارة ومراقبة فرص الاستثمار المتاحة في المنصة
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الفرص</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <DataTable columns={columns} data={opportunities || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}