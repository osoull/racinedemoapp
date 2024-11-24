import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  FileText,
  Settings,
  Wallet,
  MessageSquare,
  ClipboardCheck
} from "lucide-react"
import { SidebarItem } from "../admin/SidebarItem"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/borrower",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "طلبات التمويل",
    icon: FileText,
    path: "/borrower/loans",
    description: "إدارة طلبات التمويل"
  },
  {
    title: "المدفوعات",
    icon: Wallet,
    path: "/borrower/payments",
    description: "إدارة المدفوعات والأقساط"
  },
  {
    title: "التحقق والوثائق",
    icon: ClipboardCheck,
    path: "/borrower/verification",
    description: "إدارة وثائق KYC والتحقق"
  },
  {
    title: "الدعم الفني",
    icon: MessageSquare,
    path: "/borrower/support",
    description: "طلب المساعدة والدعم"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/borrower/settings",
    description: "إعدادات الحساب"
  }
]

export const BorrowerSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col bg-white">
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