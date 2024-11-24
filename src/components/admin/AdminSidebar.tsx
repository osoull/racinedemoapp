import { useLocation } from "react-router-dom"
import { 
  Users, 
  Briefcase, 
  Wallet,
  ShieldCheck,
  HeadphonesIcon,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  FileText,
  Eye,
  FileCheck,
  Cog
} from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

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
    description: "إدارة المستخدمين"
  },
  {
    title: "المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "إدارة المشاريع"
  },
  {
    title: "التقارير",
    icon: FileText,
    path: "/admin/reports",
    description: "تقارير النظام"
  },
  {
    title: "التحقق من الهوية",
    icon: Eye,
    path: "/admin/identity",
    description: "التحقق من الهوية"
  },
  {
    title: "طلبات الترقية",
    icon: FileCheck,
    path: "/admin/upgrade",
    description: "طلبات الترقية"
  },
  {
    title: "الإعدادات",
    icon: Cog,
    path: "/admin/settings",
    description: "إعدادات النظام"
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
      <nav className="flex-1 space-y-1 p-4">
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