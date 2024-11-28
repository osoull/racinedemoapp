import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard"
import { Loader2 } from "lucide-react"

export default function InvestmentOpportunitiesPage() {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["funding-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          *,
          owner:profiles(first_name, last_name)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
            اكتشف فرص الاستثمار المتاحة
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities?.map((opportunity) => (
            <ProjectCard
              key={opportunity.id}
              title={opportunity.title}
              description={opportunity.description}
              progress={(opportunity.current_funding / opportunity.funding_goal) * 100}
              status={opportunity.status}
              fundingGoal={opportunity.funding_goal}
              currentFunding={opportunity.current_funding}
              projectId={opportunity.id}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}