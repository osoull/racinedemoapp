import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KycStatusLabel } from "@/components/admin/KycStatusLabel"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { Loader2, Wallet, FileText, PieChart, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { useBorrowerStats } from "@/hooks/useBorrowerStats"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/feeCalculations"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "payment_date",
    header: "التاريخ",
    cell: ({ row }) => new Date(row.getValue("payment_date")).toLocaleDateString("ar-SA"),
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => formatCurrency(row.getValue("amount")),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={
          status === "completed" ? "default" :
          status === "pending" ? "secondary" :
          "destructive"
        }>
          {status === "completed" ? "مكتمل" :
           status === "pending" ? "قيد المعالجة" :
           "فشل"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "funding_request_title",
    header: "المشروع",
  },
]

export function BorrowerDashboardOverview() {
  const { user } = useAuth()
  const { data: stats, isLoading: isLoadingStats } = useBorrowerStats()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["borrower-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          borrower_kyc (*)
        `)
        .eq("id", user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const { data: recentPayments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["recent-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_borrower_payment_history", {
          p_borrower_id: user?.id
        })
        .limit(5)

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  if (isLoadingProfile || isLoadingStats || isLoadingPayments) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KYC Status Card */}
      {profile?.kyc_status !== "approved" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-orange-800">التحقق من الهوية</CardTitle>
              <KycStatusLabel status={profile?.kyc_status} />
            </div>
          </CardHeader>
          <CardContent>
            {profile?.kyc_status === "rejected" && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                تم رفض طلب التحقق من هويتك. يرجى مراجعة المعلومات وإعادة تقديم الطلب.
              </div>
            )}
            
            {profile?.kyc_status !== "approved" && <BorrowerKYCForm />}
          </CardContent>
        </Card>
      )}

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي التمويل المطلوب"
          value={stats?.total_requested || 0}
          icon={Wallet}
          showAsCurrency
        />
        <StatCard
          title="التمويل المستلم"
          value={stats?.total_funded || 0}
          icon={TrendingUp}
          showAsCurrency
        />
        <StatCard
          title="الطلبات النشطة"
          value={stats?.active_requests || 0}
          icon={FileText}
        />
        <StatCard
          title="نسبة النجاح"
          value={stats?.success_rate || 0}
          icon={PieChart}
          suffix="%"
        />
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              متوسط وقت الموافقة
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.average_funding_time || "لا يوجد بيانات"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              المدفوعات المعلقة
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pending_payments || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              إجمالي الرسوم المدفوعة
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.total_fees_paid || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>آخر المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={recentPayments || []} />
        </CardContent>
      </Card>
    </div>
  )
}