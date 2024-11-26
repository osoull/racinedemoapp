import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { useToast } from "@/components/ui/use-toast"

type Commission = Tables<"commissions">

export const useCommissionUpdates = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateCommissionRate = async (commissionId: string, newRate: number) => {
    try {
      // First, optimistically update the UI
      queryClient.setQueryData(["commissions"], (oldData: Commission[] | undefined) => {
        if (!oldData) return oldData
        return oldData.map(commission => 
          commission.commission_id === commissionId 
            ? { ...commission, rate: newRate, updated_at: new Date().toISOString() }
            : commission
        )
      })

      // Then perform the actual update
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

      toast({
        title: "تم تحديث العمولة",
        description: "تم تحديث معدل العمولة بنجاح",
      })

    } catch (error) {
      console.error("Error updating commission rate:", error)
      
      // Revert the optimistic update in case of error
      queryClient.setQueryData(["commissions"], (oldData: Commission[] | undefined) => {
        if (!oldData) return oldData
        return oldData.map(commission => 
          commission.commission_id === commissionId 
            ? { ...commission, rate: commission.rate }
            : commission
        )
      })

      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معدل العمولة",
        variant: "destructive",
      })
      throw error
    }
  }

  return { updateCommissionRate }
}