import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BorrowerDocuments } from "../borrower/details/BorrowerDocuments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface KYCVerificationDialogProps {
  request: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KYCVerificationDialog({ request, open, onOpenChange }: KYCVerificationDialogProps) {
  const { toast } = useToast()

  const handleUpdateKYCStatus = async (status: 'approved' | 'rejected') => {
    try {
      // Vérifier si tous les documents sont validés avant d'approuver le KYC
      if (status === 'approved') {
        const { data: documents } = await supabase
          .from('kyc_documents')
          .select('status')
          .eq('user_id', request.id)

        const allDocumentsApproved = documents?.every(doc => doc.status === 'approved')
        
        if (!allDocumentsApproved) {
          toast({
            title: "خطأ",
            description: "يجب اعتماد جميع المستندات قبل اعتماد الهوية",
            variant: "destructive",
          })
          return
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: status,
        })
        .eq('id', request.id)

      if (error) throw error

      // Ajouter l'historique du changement de statut
      await supabase
        .from('kyc_status_history')
        .insert({
          user_id: request.id,
          old_status: request.kyc_status,
          new_status: status,
          changed_by: (await supabase.auth.getUser()).data.user?.id,
        })

      toast({
        title: "تم تحديث الحالة",
        description: status === 'approved' ? "تم اعتماد الهوية بنجاح" : "تم رفض الهوية",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive",
      })
    }
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>مراجعة طلب التحقق من الهوية</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">معلومات المستخدم</TabsTrigger>
            <TabsTrigger value="documents">المستندات المطلوبة</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">الاسم الكامل</p>
                    <p className="text-sm text-muted-foreground">
                      {request.first_name} {request.middle_name} {request.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">رقم الهوية</p>
                    <p className="text-sm text-muted-foreground">{request.national_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">رقم الهاتف</p>
                    <p className="text-sm text-muted-foreground">{request.phone}</p>
                  </div>
                </div>

                {request.user_type === 'borrower' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">اسم الشركة</p>
                      <p className="text-sm text-muted-foreground">{request.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">السجل التجاري</p>
                      <p className="text-sm text-muted-foreground">{request.commercial_register}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">نوع النشاط</p>
                      <p className="text-sm text-muted-foreground">{request.business_type}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <BorrowerDocuments borrower={request} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="destructive"
            onClick={() => handleUpdateKYCStatus('rejected')}
          >
            رفض
          </Button>
          <Button
            variant="default"
            onClick={() => handleUpdateKYCStatus('approved')}
          >
            اعتماد
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}