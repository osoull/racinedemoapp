import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Settings,
  MessageSquare,
  Clock,
  HelpCircle,
  LogOut
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: any
}

const items: NavItem[] = [
  {
    title: "نظرة عامة",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "المستخدمين",
    href: "/users",
    icon: Users,
  },
  {
    title: "المشاريع",
    href: "/projects",
    icon: FileText,
  },
  {
    title: "التقارير",
    href: "/reports",
    icon: Clock,
  },
  {
    title: "الامتثال",
    href: "/compliance",
    icon: MessageSquare,
  },
  {
    title: "الدعم",
    href: "/support",
    icon: HelpCircle,
  },
  {
    title: "الإعدادات",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  return (
    <div className="h-screen w-64 bg-white border-l fixed top-0 right-0">
      <div className="flex h-16 items-center border-b px-6">
        <img 
          src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo-horizontal-full.svg"
          alt="رسين"
          className="h-6"
        />
      </div>
      <div className="flex flex-col justify-between h-[calc(100vh-4rem)]">
        <nav className="space-y-1 p-4">
          {items.map((item) => (
            <Button
              key={item.href}
              variant={location.pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 mb-1",
                location.pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-4 w-4 ml-2" />
              {item.title}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut?.()}
          >
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  )
}