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

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('Profile change detected:', payload)
          const updatedProfile = payload.new as Profile
          
          // Mettre à jour le cache React Query
          await queryClient.invalidateQueries({
            queryKey: ['profile']
          })
          
          // Notifier le composant parent
          onUpdate?.(updatedProfile)
          
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
      console.log('Updating profile with:', updates)
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      console.log('Profile updated successfully:', data)

      // Forcer une invalidation immédiate du cache
      await queryClient.invalidateQueries({
        queryKey: ['profile']
      })

      // Forcer un rafraîchissement des données
      await queryClient.refetchQueries({
        queryKey: ['profile']
      })

      return data
    } catch (error) {
      console.error('Error updating profile:', error)
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