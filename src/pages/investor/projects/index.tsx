import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { InvestorSidebar } from "@/components/investor/InvestorSidebar"
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Search } from "lucide-react"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ProjectsListPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ["active-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          owner: profiles(first_name, last_name),
          risk_ratings(rating)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    }
  })

  // Subscribe to real-time updates
  useRealtimeSubscription("projects", {
    onInsert: () => {
      refetch()
      toast({
        title: "مشروع جديد",
        description: "تم إضافة مشروع جديد للقائمة"
      })
    },
    onUpdate: () => {
      refetch()
      toast({
        title: "تحديث المشروع",
        description: "تم تحديث بيانات المشروع"
      })
    },
    onDelete: () => {
      refetch()
      toast({
        title: "حذف المشروع",
        description: "تم إزالة المشروع من القائمة"
      })
    }
  })

  const filteredProjects = projects?.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout sidebar={<InvestorSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">استكشاف المشاريع</h2>
          <p className="text-muted-foreground">
            اكتشف المشاريع المتاحة للاستثمار
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن المشاريع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects?.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description || ""}
                progress={(project.current_funding / project.funding_goal) * 100}
                status={project.status}
                fundingGoal={project.funding_goal}
                currentFunding={project.current_funding || 0}
                projectId={project.id}
              />
            ))}
            {filteredProjects?.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                لم يتم العثور على مشاريع تطابق معايير البحث
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}