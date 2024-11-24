import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function ExploreProjectsPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          owner: profiles(first_name, last_name),
          risk_ratings(*)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    }
  })

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">استكشاف المشاريع</h2>
          <p className="text-muted-foreground">
            اكتشف المشاريع المتاحة للاستثمار
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description || ""}
                progress={(project.current_funding / project.funding_goal) * 100}
                status={project.status}
                fundingGoal={project.funding_goal}
                currentFunding={project.current_funding}
                projectId={project.id}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}