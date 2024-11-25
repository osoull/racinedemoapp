import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"

export function ProfileHeader() {
  const { user } = useAuth()

  return (
    <div className="relative">
      <div className="absolute inset-0 h-32 bg-gradient-to-r from-primary-100 to-primary-200" />
      <Card className="relative mt-16 max-w-4xl mx-auto overflow-visible">
        <CardContent className="pt-16 pb-8 text-center">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-semibold mt-4">{user?.email}</h2>
          <p className="text-muted-foreground">عضو منذ {new Date(user?.created_at || '').toLocaleDateString('ar-SA')}</p>
        </CardContent>
      </Card>
    </div>
  )
}