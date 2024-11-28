import { useLocation } from "react-router-dom"
import { SidebarItem } from "./SidebarItem"
import { 
  LayoutDashboard, 
  Settings,
  Shield,
  Users,
  FileText,
  Building2,
  Wallet,
  AlertCircle,
  LineChart,
  CheckCircle
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
    title: "إدارة المستثمرين",
    icon: Users,
    path: "/admin/investors",
    description: "إدارة وتتبع المستثمرين"
  },
  {
    title: "الاستثمارات",
    icon: LineChart,
    path: "/admin/investment-opportunities",
    description: "إدارة فرص الاستثمار"
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
      <div className="border-t p-4 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6">
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6L7 9V15L12 18L17 15V9L12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
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