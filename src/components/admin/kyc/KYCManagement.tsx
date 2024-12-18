import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { KYCStatsGrid } from "./stats/KYCStatsGrid"
import { KYCRequestsTable } from "./KYCRequestsTable"
import { Card } from "@/components/ui/card"

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary-800">التحقق من الهوية</h2>
          <p className="text-muted-foreground">
            إدارة ومراجعة طلبات التحقق من الهوية
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <KYCStatsGrid data={kycRequests} isLoading={isLoading} />
        <Card>
          <KYCRequestsTable data={kycRequests} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  )
}