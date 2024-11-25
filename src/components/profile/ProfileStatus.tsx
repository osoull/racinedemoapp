import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/types/user"

export function ProfileStatus() {
  const { user } = useAuth()

  const { data: profile } = useQuery<Profile>({
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

  if (!profile) return null

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">حالة الملف الشخصي</p>
            <Badge variant={profile.profile_completed ? "default" : "secondary"}>
              {profile.profile_completed ? "مكتمل" : "غير مكتمل"}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">نوع الحساب</p>
            <Badge variant="outline">
              {profile.user_type === 'borrower' ? 'مقترض' : 'مستثمر'}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">حالة التحقق</p>
            <Badge variant={profile.kyc_status === 'approved' ? "success" : "warning"}>
              {profile.kyc_status === 'approved' ? 'تم التحقق' : 'قيد المراجعة'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}