import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, AlertCircle, FileText, CreditCard, Building2, FileCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StatCard } from "@/components/dashboard/StatCard"
import { BorrowerFundingHistory } from "@/components/admin/borrower/details/BorrowerFundingHistory"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function BorrowerDashboardOverview() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["borrower-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          id,
          funding_goal,
          current_funding,
          status
        `)
        .eq("owner_id", user?.id)

      if (error) throw error

      const totalRequested = data.reduce((sum, req) => sum + req.funding_goal, 0)
      const totalFunded = data.reduce((sum, req) => sum + (req.current_funding || 0), 0)
      const activeRequests = data.filter(req => req.status === 'active').length
      const totalRequests = data.length
      const pendingPayments = data.filter(req => req.status === 'approved' && req.current_funding > 0).length

      return {
        totalRequested,
        totalFunded,
        activeRequests,
        totalRequests,
        pendingPayments
      }
    },
    enabled: !!user,
  })

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  if (isLoadingStats || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const quickActions = [
    {
      title: "طلب تمويل جديد",
      icon: FileText,
      action: () => navigate("/borrower/funding-requests/new"),
      description: "تقديم طلب تمويل جديد لمشروعك"
    },
    {
      title: "إدارة المدفوعات",
      icon: CreditCard,
      action: () => navigate("/borrower/payments"),
      description: "عرض وإدارة المدفوعات والأقساط"
    },
    {
      title: "الملف التعريفي",
      icon: Building2,
      action: () => navigate("/borrower/profile"),
      description: "تحديث معلومات الشركة والوثائق"
    },
    {
      title: "التحقق من الهوية",
      icon: FileCheck,
      action: () => navigate("/borrower/kyc"),
      description: "إكمال عملية التحقق من الهوية"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          مرحباً بك {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      {/* KYC Alert if not approved */}
      {profile?.kyc_status !== 'approved' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>تنبيه</AlertTitle>
          <AlertDescription>
            يجب إكمال عملية التحقق من الهوية للتمكن من تقديم طلبات التمويل
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">إجراءات سريعة</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={action.action}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <action.icon className="h-5 w-5" />
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="إجمالي التمويل المطلوب"
          value={stats?.totalRequested || 0}
          icon={AlertCircle}
          showAsCurrency
        />
        <StatCard
          title="إجمالي التمويل المستلم"
          value={stats?.totalFunded || 0}
          icon={AlertCircle}
          showAsCurrency
        />
        <StatCard
          title="الطلبات النشطة"
          value={stats?.activeRequests || 0}
          icon={AlertCircle}
        />
        <StatCard
          title="المدفوعات المستحقة"
          value={stats?.pendingPayments || 0}
          icon={AlertCircle}
        />
        <StatCard
          title="إجمالي الطلبات"
          value={stats?.totalRequests || 0}
          icon={AlertCircle}
        />
      </div>

      {/* Funding History */}
      <BorrowerFundingHistory borrowerId={user?.id || ''} />
    </div>
  )
}