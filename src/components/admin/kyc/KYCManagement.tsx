import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { KYCVerificationList } from "./KYCVerificationList"
import { Badge } from "@/components/ui/badge"

export function KYCManagement() {
  const { data: kycRequests, isLoading } = useQuery({
    queryKey: ["kyc-requests"],
    queryFn: async () => {
      // First get profiles with KYC status pending or under review
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          *,
          investor_kyc (verification_status),
          borrower_kyc (verification_status)
        `)
        .or('kyc_status.eq.pending,kyc_status.eq.under_review')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Then fetch documents for these profiles
      const profileIds = profiles?.map(p => p.id) || []
      const { data: documents, error: documentsError } = await supabase
        .from("kyc_documents")
        .select('*')
        .in('user_id', profileIds)

      if (documentsError) throw documentsError

      // Combine the data
      return profiles?.map(profile => ({
        ...profile,
        kyc_documents: documents?.filter(doc => doc.user_id === profile.id) || []
      }))
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-800">التحقق من الهوية</h2>
        <p className="text-muted-foreground">
          إدارة ومراجعة طلبات التحقق من الهوية
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                kycRequests?.length || 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المستثمرون</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                kycRequests?.filter(r => r.user_type === "basic_investor" || r.user_type === "qualified_investor").length || 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المقترضون</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                kycRequests?.filter(r => r.user_type === "borrower").length || 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>قيد المراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                kycRequests?.filter(r => r.kyc_status === "under_review").length || 0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>طلبات التحقق من الهوية</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <KYCVerificationList requests={kycRequests || []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}