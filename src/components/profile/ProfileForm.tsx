import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Profile } from "@/types/user"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { PersonalFields } from "./PersonalFields"
import { AddressFields } from "./AddressFields"

export function ProfileForm() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: initialProfile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID")
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error
      
      return data as Profile
    },
    enabled: !!user?.id,
  })

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile)
    }
  }, [initialProfile])

  const validateRequiredFields = () => {
    const requiredFields = {
      first_name: 'الاسم الأول',
      last_name: 'اسم العائلة',
      phone: 'رقم الهاتف',
      national_id: 'رقم الهوية',
      street_number: 'رقم المبنى',
      street_name: 'اسم الشارع',
      postal_code: 'الرمز البريدي',
      city: 'المدينة',
      country: 'البلد'
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !profile[key as keyof Profile])
      .map(([_, label]) => label)

    if (missingFields.length > 0) {
      toast({
        title: "خطأ",
        description: `يرجى ملء الحقول التالية: ${missingFields.join('، ')}`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      })
      return
    }

    const isValid = validateRequiredFields()
    if (!isValid) return // Arrêter si la validation échoue
    
    setSaving(true)
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلوماتك الشخصية بنجاح",
      })
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
          <PersonalFields profile={profile} setProfile={setProfile} />
          <AddressFields profile={profile} setProfile={setProfile} />

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