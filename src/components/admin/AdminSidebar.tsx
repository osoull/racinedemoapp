import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Settings,
  MessageSquare,
  Shield,
  PieChart,
  Briefcase,
  Wallet,
  Scale,
  BookOpen,
  Settings2,
  HelpCircle
} from "lucide-react"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "المستخدمين",
    icon: Users,
    path: "/admin/users",
    description: "إدارة المستخدمين"
  },
  {
    title: "المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "إدارة المشاريع"
  },
  {
    title: "المعاملات المالية",
    icon: Wallet,
    path: "/admin/transactions",
    description: "متابعة المعاملات"
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
    title: "إعدادات المنصة",
    icon: Settings,
    path: "/admin/platform-settings",
    description: "إعدادات عامة للمنصة",
    subItems: [
      {
        title: "العمولات",
        icon: Scale,
        path: "/admin/platform-settings/commissions",
        description: "إدارة العمولات والرسوم"
      },
      {
        title: "الحساب البنكي",
        icon: Wallet,
        path: "/admin/platform-settings/bank",
        description: "إدارة معلومات الحساب البنكي"
      },
      {
        title: "الامتثال",
        icon: Shield,
        path: "/admin/platform-settings/compliance",
        description: "إدارة متطلبات الامتثال"
      },
      {
        title: "التقارير",
        icon: FileText,
        path: "/admin/platform-settings/reports",
        description: "إدارة التقارير"
      }
    ]
  }
]

export const AdminSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col bg-white">
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.path} className="space-y-1">
            <SidebarItem
              {...item}
              isActive={location.pathname === item.path || 
                (item.subItems?.some(subItem => location.pathname === subItem.path) ?? false)}
            />
            {item.subItems && (
              <div className="mr-6 border-r pr-2 pt-1">
                {item.subItems.map((subItem) => (
                  <SidebarItem
                    key={subItem.path}
                    {...subItem}
                    isActive={location.pathname === subItem.path}
                  />
                ))}
              </div>
            )}
          </div>
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