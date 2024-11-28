import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KycStatusLabel } from "@/components/admin/KycStatusLabel"
import { BorrowerKYCForm } from "@/components/borrower/BorrowerKYCForm"
import { Loader2 } from "lucide-react"

export function BorrowerDashboardOverview() {
  const { user } = useAuth()

  const { data: profile, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
    </div>
  )
}