import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

export const usePlatformStats = () => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      // Get total investments
      const { data: investments, error: investmentsError } = await supabase
        .from("investments")
        .select("amount")
        .eq("status", "completed")
      
      if (investmentsError) throw investmentsError

      // Get number of unique investors
      const { data: investors, error: investorsError } = await supabase
        .from("profiles")
        .select("count")
        .eq("user_type", "investor")
        .single()

      if (investorsError) throw investorsError

      // Get number of approved projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("count")
        .eq("status", "approved")
        .single()

      if (projectsError) throw projectsError

      // Calculate total investment
      const totalInvestment = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0

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
    const investmentsChannel = supabase
      .channel('investments_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'investments' },
        () => refetch()
      )
      .subscribe()

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
      supabase.removeChannel(investmentsChannel)
      supabase.removeChannel(projectsChannel)
      supabase.removeChannel(profilesChannel)
    }
  }, [refetch])

  return {
    stats,
    isLoading
  }
}