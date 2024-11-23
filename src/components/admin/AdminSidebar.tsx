import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Users, 
  Briefcase, 
  Wallet,
  ShieldCheck,
  FileText,
  HeadphonesIcon
} from "lucide-react"

interface SidebarItem {
  title: string
  icon: any
  path: string
  description: string
  color: string
}

const menuItems: SidebarItem[] = [
  {
    title: "المستخدمين",
    icon: Users,
    path: "/admin/users",
    description: "إدارة المستخدمين والأدوار",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "المشاريع",
    icon: Briefcase,
    path: "/admin/projects",
    description: "إدارة المشاريع والتمويل",
    color: "bg-green-500/10 text-green-500"
  },
  {
    title: "العمولات",
    icon: Wallet,
    path: "/admin/commissions",
    description: "إدارة العمولات والمدفوعات",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    title: "الامتثال",
    icon: ShieldCheck,
    path: "/admin/compliance",
    description: "مراجعة وثائق KYC",
    color: "bg-yellow-500/10 text-yellow-500"
  },
  {
    title: "المحتوى",
    icon: FileText,
    path: "/admin/content",
    description: "إدارة محتوى المنصة",
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    title: "الدعم",
    icon: HeadphonesIcon,
    path: "/admin/support",
    description: "إدارة تذاكر الدعم",
    color: "bg-orange-500/10 text-orange-500"
  }
]

export const AdminSidebar = () => {
  return (
    <Card className="col-span-12 md:col-span-3 h-fit">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-right"
            >
              <div className={`p-2 rounded-lg ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}