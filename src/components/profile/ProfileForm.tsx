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
  
  const { data: initialProfile, isLoading } = useQuery<Profile>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile)
    }
  }, [initialProfile])

  const { updateProfile } = useProfileSync((updatedProfile) => {
    if (updatedProfile) {
      setProfile(updatedProfile)
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        ...profile,
        profile_completed: true // Marquer le profil comme complété après la mise à jour
      })
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلوماتك الشخصية بنجاح",
      })
    } catch (error) {
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

            {profile.user_type === 'borrower' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم الشركة</label>
                  <Input
                    value={profile.company_name || ''}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    placeholder="أدخل اسم الشركة"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">السجل التجاري</label>
                  <Input
                    value={profile.commercial_register || ''}
                    onChange={(e) => setProfile({ ...profile, commercial_register: e.target.value })}
                    placeholder="أدخل رقم السجل التجاري"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع النشاط التجاري</label>
                  <Input
                    value={profile.business_type || ''}
                    onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
                    placeholder="أدخل نوع النشاط التجاري"
                  />
                </div>

                <div className="space-y-2 col-span-full">
                  <label className="text-sm font-medium">وصف النشاط التجاري</label>
                  <Textarea
                    value={profile.business_description || ''}
                    onChange={(e) => setProfile({ ...profile, business_description: e.target.value })}
                    placeholder="أدخل وصف النشاط التجاري"
                  />
                </div>
              </>
            )}
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