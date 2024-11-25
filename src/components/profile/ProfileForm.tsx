import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useProfileSync } from "@/hooks/useProfileSync"
import { Profile } from "@/types/user"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function ProfileForm() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: initialProfile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log('Fetching profile for user:', user?.id)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }
      
      console.log('Fetched profile:', data)
      return data as Profile
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (initialProfile) {
      console.log('Setting initial profile:', initialProfile)
      setProfile(initialProfile)
    }
  }, [initialProfile])

  const { updateProfile } = useProfileSync((updatedProfile) => {
    console.log('Profile sync callback with:', updatedProfile)
    if (updatedProfile) {
      setProfile(updatedProfile)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      console.log('Submitting profile update:', profile)
      await updateProfile({
        ...profile,
        profile_completed: true
      })
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلوماتك الشخصية بنجاح",
      })
      
      // Forcer un rafraîchissement des données
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المعلومات",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        حدث خطأ أثناء تحميل البيانات
      </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>المعلومات الشخصية</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">الاسم الأول</label>
              <Input
                value={profile.first_name || ''}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                placeholder="أدخل اسمك الأول"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">اسم العائلة</label>
              <Input
                value={profile.last_name || ''}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                placeholder="أدخل اسم عائلتك"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الهاتف</label>
              <Input
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="أدخل رقم هاتفك"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الهوية</label>
              <Input
                value={profile.national_id || ''}
                onChange={(e) => setProfile({ ...profile, national_id: e.target.value })}
                placeholder="أدخل رقم هويتك"
                dir="ltr"
              />
            </div>

            <div className="space-y-2 col-span-full">
              <label className="text-sm font-medium">العنوان</label>
              <Textarea
                value={profile.address || ''}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="أدخل عنوانك"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} size="lg">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}