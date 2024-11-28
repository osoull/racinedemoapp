import { useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Settings,
  Wallet,
  Shield,
  CheckCircle
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
      <div className="border-t p-4 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            مرخصة من البنك المركزي السعودي
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            معتمد - اللجنة الشرعية شركة رسين للاستثمار
          </p>
        </div>
      </div>
    </div>
  )
}