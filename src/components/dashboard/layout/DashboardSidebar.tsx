import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Wallet,
  Settings,
  MessageSquare,
  Shield,
  PieChart,
  LogOut
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: any
  roles: string[]
}

const items: NavItem[] = [
  {
    title: "نظرة عامة",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "investment_manager", "investor", "project_owner"],
  },
  {
    title: "المستخدمين",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "المشاريع",
    href: "/projects",
    icon: Briefcase,
    roles: ["admin", "investment_manager", "project_owner"],
  },
  {
    title: "الاستثمارات",
    href: "/investments",
    icon: Wallet,
    roles: ["admin", "investment_manager", "investor"],
  },
  {
    title: "التقارير",
    href: "/reports",
    icon: PieChart,
    roles: ["admin", "investment_manager"],
  },
  {
    title: "الامتثال",
    href: "/compliance",
    icon: Shield,
    roles: ["admin"],
  },
  {
    title: "الدعم",
    href: "/support",
    icon: MessageSquare,
    roles: ["admin", "investment_manager", "investor", "project_owner"],
  },
  {
    title: "الإعدادات",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "investment_manager", "investor", "project_owner"],
  },
]

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const filteredItems = items.filter(item => 
    item.roles.includes(user?.user_metadata?.user_type || '')
  )

  return (
    <div className="h-screen w-64 bg-white border-l fixed top-0 right-0">
      <div className="flex h-16 items-center border-b px-6">
        <img 
          src="/logo.svg" 
          alt="Raseen Logo" 
          className="h-8"
        />
      </div>
      <nav className="space-y-1 p-4">
        {filteredItems.map((item) => (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              location.pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            onClick={() => navigate(item.href)}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        ))}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 mt-4"
          onClick={() => signOut?.()}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </nav>
    </div>
  )
}