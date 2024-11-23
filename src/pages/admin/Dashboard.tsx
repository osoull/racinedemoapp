import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import CommissionManagement from "@/components/admin/CommissionManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import ContentManagement from "@/components/admin/ContentManagement"
import SupportTools from "@/components/admin/SupportTools"
import { UserAvatar } from "@/components/UserAvatar"
import { 
  Activity, 
  Users, 
  Briefcase, 
  FileText, 
  HeadphonesIcon, 
  Settings,
  BarChart3,
  Bell,
  Wallet,
  ShieldCheck
} from "lucide-react"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user?.id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate("/")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (profile?.user_type !== "admin") {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
        variant: "destructive",
      })
      navigate("/")
    }
  }

  const menuItems = [
    {
      title: "المستخدمين",
      icon: Users,
      value: "users",
      description: "إدارة المستخدمين والأدوار",
      component: UserManagement,
      stats: "1,234",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "المشاريع",
      icon: Briefcase,
      value: "projects",
      description: "إدارة المشاريع والتمويل",
      component: ProjectManagement,
      stats: "56",
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "العمولات",
      icon: Wallet,
      value: "commissions",
      description: "إدارة العمولات والمدفوعات",
      component: CommissionManagement,
      stats: "$12.5K",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "الامتثال",
      icon: ShieldCheck,
      value: "compliance",
      description: "مراجعة وثائق KYC",
      component: ComplianceAudit,
      stats: "89%",
      color: "bg-yellow-500/10 text-yellow-500"
    },
    {
      title: "المحتوى",
      icon: FileText,
      value: "content",
      description: "إدارة محتوى المنصة",
      component: ContentManagement,
      stats: "45",
      color: "bg-pink-500/10 text-pink-500"
    },
    {
      title: "الدعم",
      icon: HeadphonesIcon,
      value: "support",
      description: "إدارة تذاكر الدعم",
      component: SupportTools,
      stats: "12",
      color: "bg-orange-500/10 text-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile ? `مرحباً بك, ${profile.first_name}` : "مرحباً بك"}
            </h1>
            <p className="text-gray-500 mt-1">لوحة تحكم المشرف</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <UserAvatar />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {menuItems.slice(0, 4).map((item) => (
            <Card key={item.value} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-bold">{item.stats}</p>
                </div>
                <h3 className="font-semibold mt-4">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <Card className="col-span-12 md:col-span-3 h-fit">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => navigate(`/admin/${item.value}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-right"
                  >
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <Card className="col-span-12 md:col-span-9">
            <CardContent className="p-6">
              <UserManagement />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard