import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function ProfileHeader() {
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
    <div className="relative">
      <div className="absolute inset-0 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-3xl" />
      <Card className="relative mt-16 max-w-4xl mx-auto overflow-visible border-none bg-card/50 backdrop-blur-xl shadow-xl">
        <CardContent className="pt-16 pb-8 text-center">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {profile.first_name?.charAt(0)?.toUpperCase()}
                {profile.last_name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-semibold mt-4 text-foreground">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-muted-foreground">
            عضو منذ {new Date(profile.created_at).toLocaleDateString('ar-SA')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}