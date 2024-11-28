import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KycStatusLabel } from "../KycStatusLabel"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

  const getVerificationStatus = () => {
    const totalDocs = user.kyc_documents?.length || 0
    const verifiedDocs = user.kyc_documents?.filter((doc: any) => doc.status === 'approved').length || 0
    
    if (totalDocs === 0) return 'لم يتم رفع أي مستندات'
    return `${verifiedDocs} من ${totalDocs} مستندات معتمدة`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{user.first_name} {user.last_name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <KycStatusLabel status={user.kyc_status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">معلومات المستخدم</h4>
              <p className="text-sm">نوع المستخدم: {user.user_type === 'borrower' ? 'طالب تمويل' : 'مستثمر'}</p>
              <p className="text-sm">رقم الهوية: {user.national_id || 'غير محدد'}</p>
              <p className="text-sm">رقم الجوال: {user.phone || 'غير محدد'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">حالة التحقق</h4>
              <p className="text-sm">{getVerificationStatus()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">المستندات المرفقة</h4>
            <ScrollArea className="h-[150px] rounded-md border p-4">
              {user.kyc_documents?.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{doc.document_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.document_url)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {user.kyc_status === 'pending' && (
            <div className="flex gap-2 justify-end">
              <Button 
                variant="default"
                onClick={() => updateKYCStatus('approved')}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                اعتماد
              </Button>
              <Button 
                variant="destructive"
                onClick={() => updateKYCStatus('rejected')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                رفض
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}