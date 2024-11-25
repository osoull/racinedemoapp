import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

export const usePlatformStats = () => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      // Get total investments for approved projects
      const { data: approvedProjects, error: projectsError } = await supabase
        .from("projects")
        .select("current_funding")
        .eq("status", "approved")
      
      if (projectsError) throw projectsError

      // Calculate total approved funding
      const totalInvestment = approvedProjects?.reduce((sum, project) => sum + (project.current_funding || 0), 0) || 0

      // Get number of unique investors
      const { data: investors, error: investorsError } = await supabase
        .from("profiles")
        .select("count")
        .eq("user_type", "investor")
        .single()

      if (investorsError) throw investorsError

      // Get number of approved projects
      const { data: projects, error: activeProjectsError } = await supabase
        .from("projects")
        .select("count")
        .eq("status", "approved")
        .single()

      if (activeProjectsError) throw activeProjectsError

      return {
        totalInvestment,
        totalInvestors: investors?.count || 0,
        activeProjects: projects?.count || 0,
        transactionVolume: totalInvestment // For now identical to total investment
      }
    }
  })

  useEffect(() => {
    // Subscribe to changes in relevant tables
    const projectsChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        () => refetch()
      )
      .subscribe()

    const profilesChannel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => refetch()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(projectsChannel)
      supabase.removeChannel(profilesChannel)
    }
  }, [refetch])

  return {
    stats,
    isLoading
  }
}