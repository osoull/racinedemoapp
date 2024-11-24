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
  Building2
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
    description: "إدارة حسابات المستثمرين وأصحاب المشاريع"
  },
  {
    title: "إدارة المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "مراجعة وإدارة المشاريع المقدمة"
  },
  {
    title: "إدارة العمولات",
    icon: Scale,
    path: "/admin/commissions",
    description: "تكوين وتتبع العمولات"
  },
  {
    title: "التقارير",
    icon: PieChart,
    path: "/admin/reports",
    description: "تقارير وإحصائيات المنصة"
  },
  {
    title: "المعاملات المالية",
    icon: Wallet,
    path: "/admin/transactions",
    description: "متابعة وإدارة المعاملات المالية"
  },
  {
    title: "الامتثال والتدقيق",
    icon: ShieldCheck,
    path: "/admin/compliance",
    description: "مراقبة الامتثال والتدقيق"
  },
  {
    title: "الدعم الفني",
    icon: MessageSquare,
    path: "/admin/support",
    description: "إدارة طلبات الدعم الفني"
  },
  {
    title: "إعدادات المنصة",
    icon: Building2,
    path: "/admin/platform-settings",
    description: "إدارة إعدادات المنصة"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/admin/settings",
    description: "إعدادات الحساب"
  }
]

const SidebarContent = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <img src="/logo.svg" alt="Racine Logo" className="h-8" />
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
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