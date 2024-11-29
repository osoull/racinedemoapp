import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { LogOut, Settings, User } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function UserAvatar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
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
  
  const initials = user?.email?.substring(0, 2).toUpperCase() || "U"
  const userType = user?.user_metadata?.user_type

  // Déterminer les routes en fonction du type d'utilisateur
  const getProfileRoute = () => {
    switch (userType) {
      case 'borrower':
        return '/borrower/profile'
      case 'admin':
        return '/admin/profile'
      case 'basic_investor':
      case 'qualified_investor':
        return '/investor/profile'
      default:
        return '/profile'
    }
  }

  const getSettingsRoute = () => {
    switch (userType) {
      case 'borrower':
        return '/borrower/settings'
      case 'admin':
        return '/admin/settings'
      case 'basic_investor':
      case 'qualified_investor':
        return '/investor/settings'
      default:
        return '/settings'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(getProfileRoute())}>
          <User className="ml-2 h-4 w-4" />
          الملف الشخصي
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(getSettingsRoute())}>
          <Settings className="ml-2 h-4 w-4" />
          الإعدادات
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}