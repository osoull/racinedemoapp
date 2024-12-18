import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard"
import { Loader2 } from "lucide-react"

interface FundingRequest {
  id: string
  title: string
  description: string
  funding_goal: number
  current_funding: number
  status: string
  owner: {
    first_name: string
    last_name: string
  }
}

interface InvestmentOpportunity {
  id: string
  funding_request_id: string
  status: string
  start_date: string
  end_date: string | null
  total_invested: number
  created_at: string
  updated_at: string
  minimum_investment: number
  maximum_investment: number | null
  expected_return_rate: number | null
  risk_level: string | null
  investment_term_months: number | null
  funding_request: FundingRequest
}

const Investments = () => {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["investment-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_opportunities")
        .select(`
          *,
          funding_request:funding_requests!inner(
            id,
            title,
            description,
            funding_goal,
            current_funding,
            status,
            owner:profiles!funding_requests_owner_id_fkey(
              first_name,
              last_name
            )
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our types
      const typedData = data.map((opp: any) => ({
        ...opp,
        funding_request: Array.isArray(opp.funding_request) 
          ? opp.funding_request[0] 
          : opp.funding_request
      })) as InvestmentOpportunity[];

      return typedData;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout sidebar={<InvestorSidebar />}>
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">فرص الاستثمار المتاحة</h2>
          <p className="text-muted-foreground">
            اكتشف فرص الاستثمار المتاحة للمشاريع المعتمدة
          </p>
        </div>

        {opportunities && opportunities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity) => (
              <ProjectCard
                key={opportunity.id}
                title={opportunity.funding_request.title}
                description={opportunity.funding_request.description}
                progress={(opportunity.funding_request.current_funding / opportunity.funding_request.funding_goal) * 100}
                status={opportunity.funding_request.status}
                fundingGoal={opportunity.funding_request.funding_goal}
                currentFunding={opportunity.funding_request.current_funding}
                projectId={opportunity.funding_request.id}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                لا توجد فرص استثمار متاحة حالياً
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Investments;