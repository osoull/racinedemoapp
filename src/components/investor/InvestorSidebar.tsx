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
  PieChart,
  ClipboardCheck,
  Search
} from "lucide-react"
import { SidebarItem } from "../admin/SidebarItem"

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    path: "/investor",
    description: "لوحة المعلومات والإحصائيات"
  },
  {
    title: "استكشاف المشاريع",
    icon: Search,
    path: "/investor/projects",
    description: "اكتشاف فرص الاستثمار"
  },
  {
    title: "محفظتي",
    icon: Wallet,
    path: "/investor/portfolio",
    description: "إدارة استثماراتي"
  },
  {
    title: "التقارير",
    icon: PieChart,
    path: "/investor/reports",
    description: "تقارير وتحليلات الاستثمار"
  },
  {
    title: "التحقق والوثائق",
    icon: ClipboardCheck,
    path: "/investor/verification",
    description: "إدارة وثائق KYC والتحقق"
  },
  {
    title: "الدعم الفني",
    icon: MessageSquare,
    path: "/investor/support",
    description: "طلب المساعدة والدعم"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    path: "/investor/settings",
    description: "إعدادات الحساب"
  }
]

export const InvestorSidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col bg-background border-l">
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
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut?.()}
        >
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}