import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KycStatusLabel } from "@/components/admin/KycStatusLabel"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { Loader2, Wallet, FileText, PieChart, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { useBorrowerStats } from "@/hooks/useBorrowerStats"

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

  if (isLoadingProfile || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KYC Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>التحقق من الهوية</CardTitle>
            <KycStatusLabel status={profile?.kyc_status} />
          </div>
        </CardHeader>
        <CardContent>
          {profile?.kyc_status === "rejected" && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              تم رفض طلب التحقق من هويتك. يرجى مراجعة المعلومات وإعادة تقديم الطلب.
            </div>
          )}
          
          {profile?.kyc_status === "approved" ? (
            <div className="text-green-700">
              تم التحقق من هويتك بنجاح. يمكنك الآن الاستفادة من جميع خدمات المنصة.
            </div>
          ) : (
            <BorrowerKYCForm />
          )}
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      {profile?.kyc_status === "approved" && (
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
      )}
    </div>
  )
}