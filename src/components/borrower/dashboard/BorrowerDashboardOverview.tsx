import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileText, CreditCard, Building2, FileCheck } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { BorrowerFundingHistory } from "@/components/admin/borrower/details/BorrowerFundingHistory"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useBorrowerStats } from "@/hooks/useBorrowerStats"
import { Loader2 } from "lucide-react"

export function BorrowerDashboardOverview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: stats, isLoading } = useBorrowerStats()

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground">
          مرحباً بك في لوحة تحكم المقترض
        </p>
      </div>

      <div className="mt-6">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-6">
        <StatCard
          title="إجمالي التمويل المطلوب"
          value={stats?.total_requested || 0}
          icon={AlertCircle}
          showAsCurrency
        />
        <StatCard
          title="إجمالي التمويل المستلم"
          value={stats?.total_funded || 0}
          icon={AlertCircle}
          showAsCurrency
        />
        <StatCard
          title="الطلبات النشطة"
          value={stats?.active_requests || 0}
          icon={AlertCircle}
        />
        <StatCard
          title="المدفوعات المستحقة"
          value={stats?.pending_payments || 0}
          icon={AlertCircle}
        />
        <StatCard
          title="معدل النجاح"
          value={stats?.success_rate || 0}
          suffix="%"
          icon={AlertCircle}
        />
      </div>

      <div className="mt-6">
        <BorrowerFundingHistory borrowerId={user?.id || ''} />
      </div>
    </div>
  )
}
