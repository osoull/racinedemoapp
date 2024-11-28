import { LayoutDashboard, Settings, Users, Receipt, FileText } from "lucide-react"

export const platformItems = [
  {
    title: "لوحة التحكم",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "طلبات التمويل",
    href: "/admin/funding-requests",
    icon: FileText,
  },
  {
    title: "المستخدمون",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "المعاملات",
    href: "/admin/transactions",
    icon: Receipt,
  },
  {
    title: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
  },
]