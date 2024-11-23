import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  Users, 
  Briefcase, 
  Wallet,
  ShieldCheck,
  FileText,
  HeadphonesIcon,
  LayoutDashboard
} from "lucide-react"

interface SidebarItem {
  title: string
  icon: any
  path: string
  description: string
}

const menuItems: SidebarItem[] = [
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
    <aside className="hidden border-l bg-white lg:block lg:w-64">
      <nav className="grid gap-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                "animate-fade-in",
                isActive && "bg-gray-100 text-gray-900"
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}