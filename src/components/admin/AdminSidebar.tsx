import { useLocation } from "react-router-dom"
import { 
  Users, 
  Briefcase, 
  Scale,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  LayoutDashboard,
  FileText,
  PieChart,
  MessageSquare,
  Wallet,
  Building2,
  ScrollText,
  GraduationCap,
  FileCheck,
  BadgeCheck,
  UserCog,
  FileSpreadsheet,
  Receipt,
  AlertCircle,
  BookOpen,
  FileSearch,
  Building,
  Landmark,
  Banknote,
  FileQuestion,
  HelpCircle,
  Settings2
} from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

const menuItems = [
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
      },
      {
        title: "مدراء الاستثمار",
        path: "/admin/users/managers",
        icon: UserCog
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
    title: "إدارة العمولات",
    icon: Scale,
    path: "/admin/commissions",
    description: "تكوين وتتبع العمولات",
    subItems: [
      {
        title: "هيكل العمولات",
        path: "/admin/commissions/structure",
        icon: Receipt
      },
      {
        title: "سجل العمولات",
        path: "/admin/commissions/history",
        icon: ScrollText
      }
    ]
  },
  {
    title: "التقارير",
    icon: PieChart,
    path: "/admin/reports",
    description: "تقارير وإحصائيات المنصة",
    subItems: [
      {
        title: "تقارير الأداء",
        path: "/admin/reports/performance",
        icon: FileText
      },
      {
        title: "تقارير المخاطر",
        path: "/admin/reports/risk",
        icon: AlertCircle
      },
      {
        title: "تقارير الامتثال",
        path: "/admin/reports/compliance",
        icon: BookOpen
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
    title: "الامتثال والتدقيق",
    icon: ShieldCheck,
    path: "/admin/compliance",
    description: "مراقبة الامتثال والتدقيق"
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
  },
  {
    title: "متطلبات هيئة السوق المالية",
    icon: FileCheck,
    path: "/admin/cma",
    description: "إدارة متطلبات هيئة السوق المالية",
    subItems: [
      {
        title: "التراخيص",
        path: "/admin/cma/licenses",
        icon: Building
      },
      {
        title: "التقارير الرقابية",
        path: "/admin/cma/reports",
        icon: FileText
      },
      {
        title: "الامتثال",
        path: "/admin/cma/compliance",
        icon: ShieldCheck
      }
    ]
  },
  {
    title: "الدعم الفني",
    icon: MessageSquare,
    path: "/admin/support",
    description: "إدارة طلبات الدعم الفني",
    subItems: [
      {
        title: "التذاكر الجديدة",
        path: "/admin/support/new",
        icon: HelpCircle
      },
      {
        title: "التذاكر المفتوحة",
        path: "/admin/support/open",
        icon: MessageSquare
      },
      {
        title: "التذاكر المغلقة",
        path: "/admin/support/closed",
        icon: FileCheck
      }
    ]
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
        icon: Settings
      },
      {
        title: "إعدادات الأمان",
        path: "/admin/platform-settings/security",
        icon: ShieldCheck
      },
      {
        title: "إعدادات المدفوعات",
        path: "/admin/platform-settings/payments",
        icon: Wallet
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

const SidebarContent = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.path
    
    return (
      <div key={item.path} className="space-y-1">
        <SidebarItem
          {...item}
          isActive={isActive}
        />
        {item.subItems && isActive && (
          <div className="mr-4 border-r pr-4 pt-2">
            {item.subItems.map((subItem: any) => (
              <SidebarItem
                key={subItem.path}
                {...subItem}
                isActive={location.pathname === subItem.path}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <img src="/logo.svg" alt="Racine Logo" className="h-8" />
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map(renderMenuItem)}
      </nav>
      <div className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut?.()}
        >
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}

export const AdminSidebar = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed top-0 right-0 bottom-0 w-72 border-l bg-white shadow-sm hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full w-72 fixed right-0 top-0 rounded-none">
            <SidebarContent />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}