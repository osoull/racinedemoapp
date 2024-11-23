import { useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { UserAvatar } from "@/components/UserAvatar"
import { Bell, Search, Menu, ChevronRight } from "lucide-react"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import CommissionManagement from "@/components/admin/CommissionManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import ContentManagement from "@/components/admin/ContentManagement"
import SupportTools from "@/components/admin/SupportTools"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
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

  const getBreadcrumb = () => {
    const path = location.pathname.split("/").filter(Boolean)
    if (path.length <= 1) return "لوحة التحكم"
    
    const pageMap: { [key: string]: string } = {
      users: "المستخدمين",
      projects: "المشاريع",
      commissions: "العمولات",
      compliance: "الامتثال",
      content: "المحتوى",
      support: "الدعم"
    }
    
    return pageMap[path[1]] || "لوحة التحكم"
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <AdminSidebar />
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center gap-4">
            <div className="hidden md:flex md:flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-gray-900">{getBreadcrumb()}</span>
              </div>
              <form className="flex-1 mr-4 ml-4 lg:ml-6">
                <div className="relative">
                  <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="البحث..."
                    className="w-full max-w-[300px] bg-gray-50/50 pr-8"
                    type="search"
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white">
                3
              </span>
            </Button>
            <UserAvatar />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile ? `مرحباً بك, ${profile.first_name}` : "مرحباً بك"}
            </h1>
            <p className="text-gray-500 mt-1">لوحة تحكم المشرف</p>
          </div>

          <div className={cn(
            "rounded-lg border bg-white/80 backdrop-blur-sm shadow-sm",
            "animate-fade-in"
          )}>
            <Routes>
              <Route index element={<UserManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="commissions" element={<CommissionManagement />} />
              <Route path="compliance" element={<ComplianceAudit />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="support" element={<SupportTools />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard