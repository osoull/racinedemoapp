import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

export const usePlatformStats = () => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      // Récupérer le total des investissements
      const { data: investments, error: investmentsError } = await supabase
        .from("investments")
        .select("amount")
        .eq("status", "completed")
      
      if (investmentsError) throw investmentsError

      // Récupérer le nombre d'investisseurs uniques
      const { data: investors, error: investorsError } = await supabase
        .from("profiles")
        .select("count")
        .eq("user_type", "investor")
        .single()

      if (investorsError) throw investorsError

      // Récupérer le nombre de projets actifs
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("count")
        .eq("status", "active")
        .single()

      if (projectsError) throw projectsError

      // Calculer le total des investissements
      const totalInvestment = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0

      return {
        totalInvestment,
        totalInvestors: investors?.count || 0,
        activeProjects: projects?.count || 0,
        transactionVolume: totalInvestment // Pour le moment identique au total des investissements
      }
    }
  })

  useEffect(() => {
    // S'abonner aux changements des tables pertinentes
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