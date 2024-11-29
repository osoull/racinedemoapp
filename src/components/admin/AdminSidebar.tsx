import { useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Settings,
  Users,
  FileText,
  CreditCard,
  Building2,
  FileCheck,
  Scale
} from "lucide-react"
import { SidebarItem } from "./SidebarItem"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "المستثمرون",
    icon: Users,
    path: "/admin/investors",
    description: "إدارة المستثمرين"
  },
  {
    title: "المقترضون",
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
    title: "المالية",
    icon: CreditCard,
    path: "/admin/finance",
    description: "إدارة المعاملات المالية"
  },
  {
    title: "الامتثال",
    icon: Scale,
    path: "/admin/compliance",
    description: "إدارة الامتثال والتراخيص"
  },
  {
    title: "التحقق من الهوية",
    icon: FileCheck,
    path: "/admin/kyc",
    description: "إدارة طلبات التحقق"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/admin/platform-settings",
    description: "إعدادات المنصة"
  }
]

export function AdminSidebar() {
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
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/SAMA_logo.png"
              alt="البنك المركزي السعودي"
              className="h-6 w-auto"
            />
            مرخصة من البنك المركزي السعودي
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <FileCheck className="h-4 w-4" />
            معتمد - اللجنة الشرعية شركة رسين للاستثمار
          </p>
        </div>
      </div>
    </div>
  )
}