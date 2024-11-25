import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"

export function UserProfileInfo() {
  const { user } = useAuth()

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  if (!profile) return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {profile?.first_name?.charAt(0)?.toUpperCase()}
              {profile?.last_name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-4 w-full">
            <h2 className="text-xl font-semibold">
              {profile.first_name} {profile.middle_name} {profile.last_name}
            </h2>

            <div className="grid gap-3 text-right">
              <div>
                <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</p>
                <p className="font-medium">{profile.email}</p>
              </div>

              {profile.phone && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">رقم الهاتف</p>
                  <p className="font-medium" dir="ltr">{profile.phone}</p>
                </div>
              )}

              {profile.national_id && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">رقم الهوية</p>
                  <p className="font-medium" dir="ltr">{profile.national_id}</p>
                </div>
              )}

              {profile.street_number && profile.street_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">العنوان</p>
                  <p className="font-medium">
                    {profile.street_number} {profile.street_name}
                    {profile.city && `, ${profile.city}`}
                    {profile.postal_code && ` ${profile.postal_code}`}
                    {profile.country && `, ${profile.country}`}
                  </p>
                </div>
              )}

              {profile.user_type === 'borrower' && (
                <>
                  {profile.company_name && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">اسم الشركة</p>
                      <p className="font-medium">{profile.company_name}</p>
                    </div>
                  )}

                  {profile.commercial_register && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">السجل التجاري</p>
                      <p className="font-medium">{profile.commercial_register}</p>
                    </div>
                  )}

                  {profile.business_type && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">نوع النشاط</p>
                      <p className="font-medium">{profile.business_type}</p>
                    </div>
                  )}

                  {profile.business_description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">وصف النشاط</p>
                      <p className="font-medium">{profile.business_description}</p>
                    </div>
                  )}
                </>
              )}

              {(profile.user_type === 'basic_investor' || profile.user_type === 'qualified_investor') && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">نوع المستثمر</p>
                  <p className="font-medium">
                    {profile.user_type === 'basic_investor' ? 'مستثمر أساسي' : 'مستثمر مؤهل'}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">تاريخ الانضمام</p>
                <p className="font-medium">{format(new Date(profile.created_at), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}