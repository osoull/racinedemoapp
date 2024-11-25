import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/types/user"
import { Progress } from "@/components/ui/progress"

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

  // Calculate profile completion percentage
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
  ]

  const completedFields = requiredFields.filter(field => !!profile[field as keyof Profile])
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100)

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
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
                {getUserTypeLabel(profile.user_type)}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">حالة التحقق</p>
              <Badge variant={profile.kyc_status === 'approved' ? "success" : "warning"}>
                {profile.kyc_status === 'approved' ? 'تم التحقق' : 'قيد المراجعة'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">اكتمال الملف الشخصي</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}