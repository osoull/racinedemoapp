import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { AvatarUpload } from "@/components/AvatarUpload"
import { useProfileSync } from "@/hooks/useProfileSync"
import { Profile as ProfileType } from "@/types/user"

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileType>({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    address: "",
    user_type: "basic_investor",
    id: "",
    email: "",
  } as ProfileType)

  const { updateProfile } = useProfileSync((updatedProfile) => {
    if (updatedProfile) {
      setProfile(updatedProfile)
    }
  })

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data as ProfileType)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الملف الشخصي",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateProfile({
        first_name: profile.first_name,
        middle_name: profile.middle_name,
        last_name: profile.last_name,
        phone: profile.phone,
        address: profile.address,
        updated_at: new Date().toISOString(),
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-8 py-8">
      <div className="mb-8">
        <BackButton />
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <AvatarUpload />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium">
                الاسم الأول
              </label>
              <Input
                id="first_name"
                value={profile.first_name}
                onChange={(e) =>
                  setProfile({ ...profile, first_name: e.target.value })
                }
                placeholder="أدخل اسمك الأول"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="middle_name" className="text-sm font-medium">
                الاسم الأوسط
              </label>
              <Input
                id="middle_name"
                value={profile.middle_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, middle_name: e.target.value })
                }
                placeholder="أدخل اسمك الأوسط"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium">
                اسم العائلة
              </label>
              <Input
                id="last_name"
                value={profile.last_name}
                onChange={(e) =>
                  setProfile({ ...profile, last_name: e.target.value })
                }
                placeholder="أدخل اسم عائلتك"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                رقم الهاتف
              </label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="أدخل رقم هاتفك"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                العنوان
              </label>
              <Input
                id="address"
                value={profile.address || ""}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                placeholder="أدخل عنوانك"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ التغييرات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}