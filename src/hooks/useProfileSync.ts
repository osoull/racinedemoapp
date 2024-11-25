import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/types/user"
import { useQueryClient } from "@tanstack/react-query"

export const useProfileSync = (onUpdate?: (profile: Profile) => void) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No user")

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    // Forcer une invalidation immédiate du cache
    await queryClient.invalidateQueries({
      queryKey: ['profile']
    })

    // Forcer un rafraîchissement des données
    await queryClient.refetchQueries({
      queryKey: ['profile']
    })

    if (data) {
      onUpdate?.(data as Profile)
    }

    return data as Profile
  }

  return { updateProfile }
}