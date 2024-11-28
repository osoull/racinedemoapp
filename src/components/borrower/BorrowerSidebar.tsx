import { useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Settings,
  FileText,
  CreditCard,
  Building2,
  FileCheck
} from "lucide-react"
import { SidebarItem } from "../admin/SidebarItem"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/borrower/dashboard",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "طلبات التمويل",
    icon: FileText,
    path: "/borrower/funding-requests",
    description: "إدارة طلبات التمويل"
  },
  {
    title: "المدفوعات",
    icon: CreditCard,
    path: "/borrower/payments",
    description: "إدارة المدفوعات والأقساط"
  },
  {
    title: "الملف التعريفي",
    icon: Building2,
    path: "/borrower/profile",
    description: "معلومات الشركة والوثائق"
  },
  {
    title: "التحقق من الهوية",
    icon: FileCheck,
    path: "/borrower/kyc",
    description: "إدارة وثائق التحقق"
  }
]

export function BorrowerSidebar() {
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