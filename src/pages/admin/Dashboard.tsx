import { useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { UserAvatar } from "@/components/UserAvatar"
import { Bell } from "lucide-react"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import CommissionManagement from "@/components/admin/CommissionManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import ContentManagement from "@/components/admin/ContentManagement"
import SupportTools from "@/components/admin/SupportTools"

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

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <AdminSidebar />

          {/* Main Content Area */}
          <Card className="col-span-12 md:col-span-9">
            <CardContent className="p-6">
              <Routes>
                <Route index element={<UserManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="projects" element={<ProjectManagement />} />
                <Route path="commissions" element={<CommissionManagement />} />
                <Route path="compliance" element={<ComplianceAudit />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="support" element={<SupportTools />} />
              </Routes>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard