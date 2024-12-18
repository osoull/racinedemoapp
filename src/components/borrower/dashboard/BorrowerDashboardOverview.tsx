import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { useBorrowerStats } from "@/hooks/useBorrowerStats"
import { BorrowerDashboardStats } from "./BorrowerDashboardStats"
import { BorrowerAdditionalStats } from "./BorrowerAdditionalStats"
import { columns } from "./PaymentsTableColumns"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

export function BorrowerDashboardOverview() {
  const { user } = useAuth()
  const { data: stats, isLoading: isLoadingStats } = useBorrowerStats()

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["borrower-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, borrower_kyc (*)")
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
      {profile?.kyc_status !== "approved" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold text-destructive">
            يرجى استكمال عملية التحقق من الهوية للاستفادة من جميع خدمات المنصة
          </AlertDescription>
        </Alert>
      )}

      <BorrowerDashboardStats stats={stats} />
      <BorrowerAdditionalStats stats={stats} />

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