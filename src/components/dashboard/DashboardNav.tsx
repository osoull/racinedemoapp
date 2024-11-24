import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  MessageSquare,
  Shield,
  PieChart
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: any
}

const items: NavItem[] = [
  {
    title: "نظرة عامة",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "المستخدمين",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "المشاريع",
    href: "/admin/projects",
    icon: FileText,
  },
  {
    title: "التقارير",
    href: "/admin/reports",
    icon: PieChart,
  },
  {
    title: "الامتثال",
    href: "/admin/compliance",
    icon: Shield,
  },
  {
    title: "الدعم",
    href: "/admin/support",
    icon: MessageSquare,
  },
  {
    title: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="grid items-start gap-2 p-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              location.pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            onClick={() => navigate(item.href)}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Button>
        )
      })}
    </nav>
  )
}