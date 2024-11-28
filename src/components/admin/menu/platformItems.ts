import { LayoutDashboard, Settings, Users, Receipt, FileText, Wallet } from "lucide-react"

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

export const platformSettingsItems = [
  {
    title: "الإعدادات العامة",
    href: "/admin/settings/general",
    icon: Settings,
  },
  {
    title: "إدارة المستخدمين",
    href: "/admin/settings/users",
    icon: Users,
  },
  {
    title: "العمولات والرسوم",
    href: "/admin/settings/fees",
    icon: Wallet,
  },
]