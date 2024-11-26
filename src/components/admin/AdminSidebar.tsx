import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  FileText,
  Settings,
  Shield,
  Wallet,
  PieChart,
  Users,
  DollarSign
} from "lucide-react"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "المستثمرين",
    icon: Users,
    path: "/admin/investors",
    description: "إدارة المستثمرين"
  },
  {
    title: "المشاريع",
    icon: FileText,
    path: "/admin/projects",
    description: "إدارة المشاريع"
  },
  {
    title: "المقترضين",
    icon: Users,
    path: "/admin/borrowers",
    description: "إدارة المقترضين"
  },
  {
    title: "المعاملات",
    icon: Wallet,
    path: "/admin/transactions",
    description: "إدارة المعاملات المالية"
  },
  {
    title: "الإيرادات",
    icon: DollarSign,
    path: "/admin/revenue",
    description: "تتبع وتحليل الإيرادات"
  },
  {
    title: "التحقق والامتثال",
    icon: Shield,
    path: "/admin/compliance",
    description: "إدارة التحقق والامتثال"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/admin/settings",
    description: "إعدادات المنصة"
  }
]

export const AdminSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col bg-background border-l">
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>
      <div className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut?.()}
        >
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}