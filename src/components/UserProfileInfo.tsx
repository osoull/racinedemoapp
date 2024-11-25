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
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">
              {profile.first_name} {profile.last_name}
            </h2>
            <div>
              <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">تاريخ الانضمام</p>
              <p className="font-medium">{format(new Date(profile.created_at), 'dd/MM/yyyy')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}