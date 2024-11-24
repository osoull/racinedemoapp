import { Routes, Route } from "react-router-dom"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import UserManagement from "@/components/admin/UserManagement"
import ProjectManagement from "@/components/admin/ProjectManagement"
import ComplianceAudit from "@/components/admin/ComplianceAudit"
import PlatformSettings from "@/components/admin/PlatformSettings"
import CommissionManagement from "@/components/admin/CommissionManagement"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Users,
  Briefcase,
  Wallet,
  Shield,
  FileText,
  MessageSquare,
  Settings,
} from "lucide-react"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user?.id)
        .single()
      return data
    },
    enabled: !!user?.id
  })

  const quickActions = [
    {
      title: "المستخدمين",
      icon: Users,
      path: "/admin/users",
      description: "إدارة المستخدمين والصلاحيات",
      color: "bg-blue-100"
    },
    {
      title: "المشاريع",
      icon: Briefcase,
      path: "/admin/projects",
      description: "إدارة وتتبع المشاريع",
      color: "bg-green-100"
    },
    {
      title: "المعاملات",
      icon: Wallet,
      path: "/admin/transactions",
      description: "متابعة المعاملات المالية",
      color: "bg-purple-100"
    },
    {
      title: "التحقق",
      icon: Shield,
      path: "/admin/compliance",
      description: "إدارة التحقق والامتثال",
      color: "bg-yellow-100"
    },
    {
      title: "التقارير",
      icon: FileText,
      path: "/admin/reports",
      description: "عرض وتحليل التقارير",
      color: "bg-pink-100"
    },
    {
      title: "الدعم",
      icon: MessageSquare,
      path: "/admin/support",
      description: "إدارة طلبات الدعم الفني",
      color: "bg-indigo-100"
    }
  ]

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-6">
            {profile?.first_name ? `مرحباً بك ${profile.first_name} في لوحة التحكم` : 'مرحباً بك في لوحة التحكم'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.path}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/investors" element={<UserManagement filter="investor" />} />
          <Route path="users/project-owners" element={<UserManagement filter="project_owner" />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="projects/new" element={<ProjectManagement filter="pending" />} />
          <Route path="projects/active" element={<ProjectManagement filter="active" />} />
          <Route path="projects/completed" element={<ProjectManagement filter="completed" />} />
          <Route path="kyc" element={<ComplianceAudit tab="kyc" />} />
          <Route path="sharia" element={<ComplianceAudit tab="sharia" />} />
          <Route path="platform-settings" element={<PlatformSettings />} />
          <Route path="platform-settings/commissions" element={<CommissionManagement />} />
          <Route path="platform-settings/cma" element={<ComplianceAudit tab="cma" />} />
        </Routes>
      </div>
    </DashboardLayout>
  )
}