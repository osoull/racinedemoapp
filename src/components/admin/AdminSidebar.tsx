import { useLocation } from "react-router-dom"
import { 
  Users, 
  Briefcase, 
  Wallet,
  ShieldCheck,
  FileText,
  HeadphonesIcon,
  LayoutDashboard
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
  }
]

export const AdminSidebar = () => {
  const location = useLocation()

  return (
    <aside className="fixed h-full w-64 border-l bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">لوحة التحكم</h2>
      </div>
      <nav className="grid gap-1 p-4">
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