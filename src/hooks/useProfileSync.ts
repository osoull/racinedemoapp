import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Profile } from "@/types/user"
import { useQueryClient } from "@tanstack/react-query"

export const useProfileSync = (onUpdate?: (profile: Profile) => void) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          const updatedProfile = payload.new as Profile
          onUpdate?.(updatedProfile)
          
          // Invalider le cache pour forcer un rafraîchissement
          await queryClient.invalidateQueries({
            queryKey: ['profile', user.id]
          })
          
          toast({
            title: "تم التحديث",
            description: "تم تحديث معلوماتك الشخصية بنجاح",
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, onUpdate, toast, queryClient])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      // Invalider le cache immédiatement après la mise à jour
      await queryClient.invalidateQueries({
        queryKey: ['profile', user.id]
      })

      return data
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المعلومات",
        variant: "destructive",
      })
      throw error
    }
  }

  return { updateProfile }
}