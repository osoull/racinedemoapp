import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  Settings,
  Shield,
  Users,
  FileText,
  Building2,
  Wallet,
  AlertCircle
} from "lucide-react"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "الإدارة المالية",
    icon: Wallet,
    path: "/admin/finance",
    description: "إدارة المعاملات والتقارير المالية"
  },
  {
    title: "التعثرات المالية",
    icon: AlertCircle,
    path: "/admin/payment-defaults",
    description: "إدارة حالات التعثر عن السداد"
  },
  {
    title: "المستثمرين",
    icon: Users,
    path: "/admin/investors",
    description: "إدارة المستثمرين"
  },
  {
    title: "المقترضين",
    icon: Building2,
    path: "/admin/borrowers",
    description: "إدارة المقترضين"
  },
  {
    title: "طلبات التمويل",
    icon: FileText,
    path: "/admin/funding-requests",
    description: "إدارة طلبات التمويل"
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
    <div className="flex h-full flex-col border-l">
      <div className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>
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