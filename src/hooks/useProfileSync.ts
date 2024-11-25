import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Profile } from "@/types/user"

export const useProfileSync = (onUpdate?: (profile: Profile) => void) => {
  const { user } = useAuth()
  const { toast } = useToast()

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
        (payload) => {
          const updatedProfile = payload.new as Profile
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
  }, [user, onUpdate, toast])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المعلومات",
        variant: "destructive",
      })
      throw error
    }

    return data
  }

  return { updateProfile }
}