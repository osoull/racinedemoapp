import { 
  LayoutDashboard,
  Settings,
  Settings2,
  ShieldCheck,
  Wallet,
  Building2,
  UserCog
} from "lucide-react"

export const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "إعدادات المنصة",
    icon: Building2,
    path: "/admin/platform-settings",
    description: "إدارة إعدادات المنصة",
    subItems: [
      {
        title: "الإعدادات العامة",
        path: "/admin/platform-settings/general",
        icon: Settings,
        description: "الإعدادات الأساسية للمنصة"
      },
      {
        title: "إعدادات العمولات",
        path: "/admin/platform-settings/commissions",
        icon: Wallet,
        description: "إدارة معدلات العمولات"
      },
      {
        title: "إعدادات الأمان",
        path: "/admin/platform-settings/security",
        icon: ShieldCheck,
        description: "إعدادات الأمان والخصوصية"
      },
      {
        title: "إدارة المستخدمين",
        path: "/admin/platform-settings/users",
        icon: UserCog,
        description: "إدارة صلاحيات المستخدمين"
      }
    ]
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/admin/settings",
    description: "إعدادات الحساب",
    subItems: [
      {
        title: "الملف الشخصي",
        path: "/admin/settings/profile",
        icon: UserCog
      },
      {
        title: "الأمان",
        path: "/admin/settings/security",
        icon: ShieldCheck
      },
      {
        title: "التفضيلات",
        path: "/admin/settings/preferences",
        icon: Settings2
      }
    ]
  }
]