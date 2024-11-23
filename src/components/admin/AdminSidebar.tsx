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
    <aside className="fixed h-full w-64 border-l bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">لوحة التحكم</h2>
      </div>
      <nav className="grid gap-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                "group relative",
                isActive && "bg-gray-100 text-gray-900"
              )}
            >
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                isActive ? "bg-primary/10 text-primary" : "group-hover:bg-gray-100"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  {item.description}
                </p>
              </div>
              {isActive && (
                <div className="absolute right-0 h-full w-1 bg-primary rounded-l-lg" />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}