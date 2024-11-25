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

const isProfileComplete = (profile: Partial<Profile>): boolean => {
  const requiredFields = [
    'first_name',
    'last_name',
    'phone',
    'national_id',
    'street_number',
    'street_name',
    'postal_code',
    'city',
    'country'
  ] as const;

  const hasAllRequiredFields = requiredFields.every(field => 
    profile[field] && profile[field]?.toString().trim() !== ''
  );

  // Pour les emprunteurs, vérifier aussi les champs business
  if (profile.user_type === 'borrower') {
    const requiredBusinessFields = [
      'company_name',
      'commercial_register',
      'business_type',
      'business_description'
    ] as const;

    return hasAllRequiredFields && requiredBusinessFields.every(field => 
      profile[field] && profile[field]?.toString().trim() !== ''
    );
  }

  return hasAllRequiredFields;
};

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
    
    setSaving(true)
    
    try {
      const profileComplete = isProfileComplete(profile)
      
      const dataToUpdate = {
        ...profile,
        profile_completed: profileComplete,
        updated_at: new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(dataToUpdate)
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
    <Card className="max-w-4xl mx-auto mt-8 border-none bg-card/50 backdrop-blur-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">المعلومات الشخصية</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card/30 p-6 rounded-lg space-y-6">
            <PersonalFields profile={profile} setProfile={setProfile} />
          </div>
          
          <div className="bg-card/30 p-6 rounded-lg space-y-6">
            <AddressFields profile={profile} setProfile={setProfile} />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={saving} 
              size="lg"
              className="min-w-[200px] bg-primary/90 hover:bg-primary shadow-lg"
            >
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}