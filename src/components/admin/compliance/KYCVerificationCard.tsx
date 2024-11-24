import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KycStatusLabel } from "../KycStatusLabel"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface KYCVerificationCardProps {
  user: any
}

export function KYCVerificationCard({ user }: KYCVerificationCardProps) {
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

  const updateKYCStatus = async (newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ kyc_status: newStatus })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Log the status change
      const { error: historyError } = await supabase
        .from('kyc_status_history')
        .insert({
          user_id: user.id,
          old_status: user.kyc_status,
          new_status: newStatus,
          changed_by: currentUser?.id,
        })

      if (historyError) throw historyError

      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة التحقق بنجاح",
      })
    } catch (error) {
      console.error('Error updating KYC status:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{user.first_name} {user.last_name}</CardTitle>
          <KycStatusLabel status={user.kyc_status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">معلومات المستخدم</h4>
            <p>نوع المستخدم: {user.user_type === 'borrower' ? 'طالب تمويل' : 'مستثمر'}</p>
            <p>البريد الإلكتروني: {user.email}</p>
          </div>

          {user.kyc_status === 'pending' && (
            <div className="flex gap-2">
              <Button 
                variant="default"
                onClick={() => updateKYCStatus('approved')}
              >
                اعتماد
              </Button>
              <Button 
                variant="destructive"
                onClick={() => updateKYCStatus('rejected')}
              >
                رفض
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}