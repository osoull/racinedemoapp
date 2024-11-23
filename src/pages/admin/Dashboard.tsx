import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardHeader } from "@/components/admin/DashboardHeader"
import { DashboardTabs } from "@/components/admin/DashboardTabs"

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

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data: users } = await supabase
        .from("profiles")
        .select("id")
      
      const { data: projects } = await supabase
        .from("projects")
        .select("id, current_funding")
      
      const { data: investments } = await supabase
        .from("investments")
        .select("id")

      return {
        totalUsers: users?.length || 0,
        totalProjects: projects?.length || 0,
        totalInvestments: investments?.length || 0,
        totalFunding: projects?.reduce((acc, proj) => acc + (proj.current_funding || 0), 0) || 0
      }
    }
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader breadcrumb={getBreadcrumb()} />
      
      <AdminSidebar />

      <main className="pt-20 lg:pr-80 px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile ? `مرحباً بك, ${profile.first_name}` : "مرحباً بك"}
          </h1>
          <p className="text-gray-500 mt-1">هذه نظرة عامة على أداء المنصة</p>
        </div>

        <DashboardTabs stats={stats} currentPath={location.pathname} />
      </main>
    </div>
  )
}

export default AdminDashboard
