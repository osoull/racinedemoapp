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

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'مدير';
      case 'investment_manager':
        return 'مدير استثمار';
      case 'borrower':
        return 'مقترض';
      case 'investor':
        return 'مستثمر';
      default:
        return userType;
    }
  }

  return (
    <Card className="mb-8 border-none bg-card/50 backdrop-blur-xl shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">حالة الملف الشخصي</p>
            <Badge 
              variant={profile.profile_completed ? "default" : "secondary"}
              className="px-4 py-1 rounded-full"
            >
              {profile.profile_completed ? "مكتمل" : "غير مكتمل"}
            </Badge>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">نوع الحساب</p>
            <Badge 
              variant="outline"
              className="px-4 py-1 rounded-full"
            >
              {getUserTypeLabel(profile.user_type)}
            </Badge>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">حالة التحقق</p>
            <Badge 
              variant={profile.kyc_status === 'approved' ? "default" : "secondary"}
              className={`px-4 py-1 rounded-full ${
                profile.kyc_status === 'approved' 
                  ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                  : ''
              }`}
            >
              {profile.kyc_status === 'approved' ? 'تم التحقق' : 'قيد المراجعة'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}