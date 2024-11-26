import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"

type Commission = Tables<"commissions">

export const useCommissionUpdates = () => {
  const queryClient = useQueryClient()

  const updateCommissionRate = async (commissionId: string, newRate: number) => {
    try {
      const { error } = await supabase
        .from("commissions")
        .update({ 
          rate: newRate,
          updated_at: new Date().toISOString()
        })
        .eq("commission_id", commissionId)

      if (error) throw error

      // Force a refetch to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ["commissions"] })

    } catch (error) {
      console.error("Error updating commission rate:", error)
      throw error
    }
  }

  return { updateCommissionRate }
}