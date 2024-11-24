import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { KYCVerificationCard } from "./KYCVerificationCard"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KYCVerificationListProps {
  status: 'pending' | 'approved' | 'rejected'
}

export function KYCVerificationList({ status }: KYCVerificationListProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ['kyc-verifications', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          investor_kyc (*),
          borrower_kyc (*),
          kyc_documents (*)
        `)
        .eq('kyc_status', status)
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>جاري التحميل...</div>
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        {users?.map((user) => (
          <KYCVerificationCard key={user.id} user={user} />
        ))}
      </div>
    </ScrollArea>
  )
}