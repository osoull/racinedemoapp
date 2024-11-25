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
      const { data, error } = await supabase
        .from("commissions")
        .update({ 
          rate: newRate,
          updated_at: new Date().toISOString()
        })
        .eq("commission_id", commissionId)
        .select()
        .single()

      if (error) throw error

      // Mise à jour optimiste du cache
      queryClient.setQueryData(["commissions"], (oldData: Commission[] | undefined) => {
        if (!oldData) return oldData
        return oldData.map(commission => 
          commission.commission_id === commissionId ? data : commission
        )
      })

      // Invalider les requêtes liées aux transactions pour forcer leur mise à jour
      queryClient.invalidateQueries({ queryKey: ["transactions"] })

      toast({
        title: "تم تحديث العمولة",
        description: "تم تحديث معدل العمولة بنجاح",
      })

      return data
    } catch (error) {
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