import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { AvatarUpload } from "@/components/AvatarUpload"
import { useProfileSync } from "@/hooks/useProfileSync"
import { Profile as ProfileType } from "@/types/user"
import { UserProfileInfo } from "@/components/UserProfileInfo"

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
    national_id: "",
    company_name: "",
    commercial_register: "",
    business_type: "",
    business_address: "",
    business_description: "",
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
        national_id: profile.national_id,
        company_name: profile.company_name,
        commercial_register: profile.commercial_register,
        business_type: profile.business_type,
        business_address: profile.business_address,
        business_description: profile.business_description,
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
      <div className="space-y-8">
        <UserProfileInfo />
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">تحديث الملف الشخصي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <AvatarUpload />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label htmlFor="national_id" className="text-sm font-medium">
                    رقم الهوية
                  </label>
                  <Input
                    id="national_id"
                    value={profile.national_id || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, national_id: e.target.value })
                    }
                    placeholder="أدخل رقم هويتك"
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

                {profile.user_type === "borrower" && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="company_name" className="text-sm font-medium">
                        اسم الشركة
                      </label>
                      <Input
                        id="company_name"
                        value={profile.company_name || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, company_name: e.target.value })
                        }
                        placeholder="أدخل اسم الشركة"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="commercial_register" className="text-sm font-medium">
                        السجل التجاري
                      </label>
                      <Input
                        id="commercial_register"
                        value={profile.commercial_register || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, commercial_register: e.target.value })
                        }
                        placeholder="أدخل رقم السجل التجاري"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="business_type" className="text-sm font-medium">
                        نوع النشاط التجاري
                      </label>
                      <Input
                        id="business_type"
                        value={profile.business_type || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, business_type: e.target.value })
                        }
                        placeholder="أدخل نوع النشاط التجاري"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="business_address" className="text-sm font-medium">
                        عنوان العمل
                      </label>
                      <Input
                        id="business_address"
                        value={profile.business_address || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, business_address: e.target.value })
                        }
                        placeholder="أدخل عنوان العمل"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label htmlFor="business_description" className="text-sm font-medium">
                        وصف النشاط التجاري
                      </label>
                      <Textarea
                        id="business_description"
                        value={profile.business_description || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, business_description: e.target.value })
                        }
                        placeholder="أدخل وصف النشاط التجاري"
                        className="min-h-[100px]"
                      />
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ التغييرات
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}