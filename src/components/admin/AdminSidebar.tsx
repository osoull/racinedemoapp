import { useLocation } from "react-router-dom"
import { 
  Users, 
  Briefcase, 
  Wallet,
  ShieldCheck,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  Settings
} from "lucide-react"
import { SidebarItem } from "./SidebarItem"

const menuItems = [
  {
    title: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/admin",
    description: "نظرة عامة على النظام"
  },
  {
    title: "المستخدمين",
    icon: Users,
    path: "/admin/users",
    description: "إدارة المستخدمين والأدوار"
  },
  {
    title: "المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "إدارة المشاريع والتمويل"
  },
  {
    title: "العمولات",
    icon: Wallet,
    path: "/admin/commissions",
    description: "إدارة العمولات والمدفوعات"
  },
  {
    title: "الامتثال",
    icon: ShieldCheck,
    path: "/admin/compliance",
    description: "مراجعة وثائق KYC"
  },
  {
    title: "المحتوى",
    icon: FileText,
    path: "/admin/content",
    description: "إدارة محتوى المنصة"
  },
  {
    title: "الدعم",
    icon: HeadphonesIcon,
    path: "/admin/support",
    description: "إدارة تذاكر الدعم"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/admin/settings",
    description: "إعدادات النظام"
  }
]

export const AdminSidebar = () => {
  const location = useLocation()

  return (
    <aside className="fixed h-full w-72 bg-white border-l shadow-sm">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-xl font-bold text-primary">راسين للاستثمار</h2>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>
    </aside>
  )
}