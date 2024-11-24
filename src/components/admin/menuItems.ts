import {
  LayoutDashboard,
  Users,
  Briefcase,
  Scale,
  PieChart,
  Wallet,
  ShieldCheck,
  BadgeCheck,
  GraduationCap,
  MessageSquare,
  Building2,
  Settings,
  LogOut,
  FileText,
  FileSpreadsheet,
  FileCheck,
  Receipt,
  ScrollText,
  AlertCircle,
  BookOpen,
  FileSearch,
  Building,
  Landmark,
  Banknote,
  FileQuestion,
  HelpCircle,
  Settings2,
  UserCog,
} from "lucide-react"

export const businessMenuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/admin",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "إدارة المستخدمين",
    icon: Users,
    path: "/admin/users",
    description: "إدارة حسابات المستثمرين وأصحاب المشاريع",
    subItems: [
      {
        title: "المستثمرون",
        path: "/admin/users/investors",
        icon: UserCog
      },
      {
        title: "أصحاب المشاريع",
        path: "/admin/users/project-owners",
        icon: Briefcase
      }
    ]
  },
  {
    title: "إدارة المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "مراجعة وإدارة المشاريع المقدمة",
    subItems: [
      {
        title: "المشاريع الجديدة",
        path: "/admin/projects/new",
        icon: FileText
      },
      {
        title: "المشاريع النشطة",
        path: "/admin/projects/active",
        icon: FileSpreadsheet
      },
      {
        title: "المشاريع المكتملة",
        path: "/admin/projects/completed",
        icon: FileCheck
      }
    ]
  },
  {
    title: "المعاملات المالية",
    icon: Wallet,
    path: "/admin/transactions",
    description: "متابعة وإدارة المعاملات المالية",
    subItems: [
      {
        title: "الإيداعات",
        path: "/admin/transactions/deposits",
        icon: Banknote
      },
      {
        title: "السحوبات",
        path: "/admin/transactions/withdrawals",
        icon: Wallet
      },
      {
        title: "التحويلات",
        path: "/admin/transactions/transfers",
        icon: Landmark
      }
    ]
  },
  {
    title: "التحقق من الهوية",
    icon: BadgeCheck,
    path: "/admin/kyc",
    description: "إدارة طلبات التحقق من الهوية",
    subItems: [
      {
        title: "الطلبات الجديدة",
        path: "/admin/kyc/new",
        icon: FileSearch
      },
      {
        title: "الطلبات المعتمدة",
        path: "/admin/kyc/approved",
        icon: FileCheck
      },
      {
        title: "الطلبات المرفوضة",
        path: "/admin/kyc/rejected",
        icon: FileQuestion
      }
    ]
  },
  {
    title: "المراجعة الشرعية",
    icon: GraduationCap,
    path: "/admin/sharia",
    description: "مراجعة توافق المشاريع مع الشريعة",
    subItems: [
      {
        title: "المراجعة الأولية",
        path: "/admin/sharia/initial",
        icon: FileSearch
      },
      {
        title: "المشاريع المعتمدة",
        path: "/admin/sharia/approved",
        icon: FileCheck
      },
      {
        title: "التقارير الشرعية",
        path: "/admin/sharia/reports",
        icon: ScrollText
      }
    ]
  }
]

export const platformSettingsItems = [
  {
    title: "إدارة العمولات",
    icon: Scale,
    path: "/admin/platform-settings/commissions",
    description: "تكوين وتتبع العمولات",
    subItems: [
      {
        title: "هيكل العمولات",
        path: "/admin/platform-settings/commissions/structure",
        icon: Receipt
      },
      {
        title: "سجل العمولات",
        path: "/admin/platform-settings/commissions/history",
        icon: ScrollText
      }
    ]
  },
  {
    title: "التقارير",
    icon: PieChart,
    path: "/admin/platform-settings/reports",
    description: "تقارير وإحصائيات المنصة",
    subItems: [
      {
        title: "تقارير الأداء",
        path: "/admin/platform-settings/reports/performance",
        icon: FileText
      },
      {
        title: "تقارير المخاطر",
        path: "/admin/platform-settings/reports/risk",
        icon: AlertCircle
      },
      {
        title: "تقارير الامتثال",
        path: "/admin/platform-settings/reports/compliance",
        icon: BookOpen
      }
    ]
  },
  {
    title: "متطلبات هيئة السوق المالية",
    icon: FileCheck,
    path: "/admin/platform-settings/cma",
    description: "إدارة متطلبات هيئة السوق المالية",
    subItems: [
      {
        title: "التراخيص",
        path: "/admin/platform-settings/cma/licenses",
        icon: Building
      },
      {
        title: "التقارير الرقابية",
        path: "/admin/platform-settings/cma/reports",
        icon: FileText
      },
      {
        title: "الامتثال",
        path: "/admin/platform-settings/cma/compliance",
        icon: ShieldCheck
      }
    ]
  },
  {
    title: "الدعم الفني",
    icon: MessageSquare,
    path: "/admin/platform-settings/support",
    description: "إدارة طلبات الدعم الفني",
    subItems: [
      {
        title: "التذاكر الجديدة",
        path: "/admin/platform-settings/support/new",
        icon: HelpCircle
      },
      {
        title: "التذاكر المفتوحة",
        path: "/admin/platform-settings/support/open",
        icon: MessageSquare
      },
      {
        title: "التذاكر المغلقة",
        path: "/admin/platform-settings/support/closed",
        icon: FileCheck
      }
    ]
  },
  {
    title: "إعدادات عامة",
    icon: Building2,
    path: "/admin/platform-settings/general",
    description: "إدارة إعدادات المنصة",
    subItems: [
      {
        title: "الإعدادات العامة",
        path: "/admin/platform-settings/general/settings",
        icon: Settings
      },
      {
        title: "إعدادات الأمان",
        path: "/admin/platform-settings/general/security",
        icon: ShieldCheck
      },
      {
        title: "إعدادات المدفوعات",
        path: "/admin/platform-settings/general/payments",
        icon: Wallet
      }
    ]
  }
]