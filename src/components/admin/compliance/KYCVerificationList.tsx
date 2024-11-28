import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { KYCVerificationCard } from "./KYCVerificationCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface KYCVerificationListProps {
  status: 'pending' | 'approved' | 'rejected'
}

export function KYCVerificationList({ status }: KYCVerificationListProps) {
  const { data: users, isLoading, error } = useQuery({
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
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.
        </AlertDescription>
      </Alert>
    )
  }

  if (!users?.length) {
    return (
      <Alert>
        <AlertDescription>
          لا توجد طلبات تحقق {status === 'pending' ? 'قيد المراجعة' : status === 'approved' ? 'معتمدة' : 'مرفوضة'} حالياً
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        {users.map((user) => (
          <KYCVerificationCard key={user.id} user={user} />
        ))}
      </div>
    </ScrollArea>
  )
}