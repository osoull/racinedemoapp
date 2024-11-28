import { useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Settings,
  Wallet,
} from "lucide-react"
import { SidebarItem } from "../admin/SidebarItem"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/investor",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "الاستثمارات",
    icon: Wallet,
    path: "/investor/investments",
    description: "إدارة استثماراتك"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/investor/settings",
    description: "إعدادات الحساب"
  }
]

export const InvestorSidebar = () => {
  const location = useLocation()

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
    </div>
  )
}