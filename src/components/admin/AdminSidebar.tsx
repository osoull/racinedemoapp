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
  MessageSquare
} from "lucide-react"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "المشاريع",
    icon: FileText,
    path: "/admin/projects",
    description: "إدارة المشاريع"
  },
  {
    title: "المعاملات",
    icon: Wallet,
    path: "/admin/transactions",
    description: "إدارة المعاملات المالية"
  },
  {
    title: "التحقق والامتثال",
    icon: Shield,
    path: "/admin/compliance",
    description: "إدارة التحقق والامتثال"
  },
  {
    title: "التقارير",
    icon: PieChart,
    path: "/admin/reports",
    description: "تقارير وإحصائيات"
  },
  {
    title: "الدعم الفني",
    icon: MessageSquare,
    path: "/admin/support",
    description: "إدارة طلبات الدعم"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/admin/settings",
    description: "إعدادات المنصة وإدارة المستخدمين"
  }
]

export const AdminSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col bg-white">
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
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut?.()}
        >
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}