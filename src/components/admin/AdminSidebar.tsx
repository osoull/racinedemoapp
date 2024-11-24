import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { platformSettingsItems } from "./menu/platformItems"
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Settings,
  MessageSquare,
  Shield,
  PieChart,
  Briefcase,
  Wallet
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
    path: "/admin/settings",
    description: "إعدادات عامة للمنصة",
    subItems: platformSettingsItems
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
              isActive={location.pathname === item.path}
            />
            {item.subItems && (
              <div className="mr-4 border-r pr-4 pt-1">
                {item.subItems.map((subItem) => (
                  <div key={subItem.path}>
                    <SidebarItem
                      {...subItem}
                      isActive={location.pathname === subItem.path}
                    />
                    {subItem.subItems && (
                      <div className="mr-4 border-r pr-4 pt-1">
                        {subItem.subItems.map((nestedItem) => (
                          <SidebarItem
                            key={nestedItem.path}
                            {...nestedItem}
                            isActive={location.pathname === nestedItem.path}
                          />
                        ))}
                      </div>
                    )}
                  </div>
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