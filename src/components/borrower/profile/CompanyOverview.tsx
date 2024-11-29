import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function CompanyOverview() {
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
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>معلومات الشركة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">اسم الشركة</p>
            <p className="font-medium">{profile.company_name}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">السجل التجاري</p>
            <p className="font-medium">{profile.commercial_register}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">نوع النشاط</p>
            <p className="font-medium">{profile.business_type}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">وصف النشاط</p>
            <p className="font-medium">{profile.business_description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>العنوان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">عنوان الشركة</p>
            <p className="font-medium">
              {profile.street_number} {profile.street_name}
              {profile.city && `, ${profile.city}`}
              {profile.postal_code && ` ${profile.postal_code}`}
              {profile.country && `, ${profile.country}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}