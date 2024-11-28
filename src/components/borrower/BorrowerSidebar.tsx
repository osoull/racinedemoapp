import { useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Settings,
} from "lucide-react"
import { SidebarItem } from "../admin/SidebarItem"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/borrower",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/borrower/settings",
    description: "إعدادات الحساب"
  }
]

export const BorrowerSidebar = () => {
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