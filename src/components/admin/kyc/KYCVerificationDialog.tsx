import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface KYCRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  user_type: string
  kyc_status: string
  created_at: string
  kyc_documents: {
    id: string
    document_type: string
    document_url: string
    status: string
    verification_notes: string | null
  }[]
}

interface KYCVerificationDialogProps {
  request: KYCRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KYCVerificationDialog({ request, open, onOpenChange }: KYCVerificationDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  if (!request) return null

  const handleVerification = async (status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true)

      const { error } = await supabase
        .from('profiles')
        .update({ kyc_status: status })
        .eq('id', request.id)

      if (error) throw error

      toast({
        title: status === 'approved' ? "تم اعتماد الطلب" : "تم رفض الطلب",
        description: status === 'approved' 
          ? "تم اعتماد طلب التحقق من الهوية بنجاح"
          : "تم رفض طلب التحقق من الهوية",
      })

      await queryClient.invalidateQueries({ queryKey: ['kyc-requests'] })
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating KYC status:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة التحقق",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>مراجعة طلب التحقق من الهوية</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">معلومات المستخدم</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الاسم الكامل</p>
                  <p>{request.first_name} {request.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p>{request.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نوع المستخدم</p>
                  <Badge variant="outline">
                    {request.user_type === "borrower"
                      ? "مقترض"
                      : request.user_type === "basic_investor"
                      ? "مستثمر أساسي"
                      : "مستثمر مؤهل"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ الطلب</p>
                  <p>{new Date(request.created_at).toLocaleDateString("ar-SA")}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">المستندات المرفقة</h3>
              <div className="space-y-4">
                {request.kyc_documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{doc.document_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.verification_notes || "لا توجد ملاحظات"}
                        </p>
                      </div>
                      <Badge variant={
                        doc.status === "approved" ? "default" :
                        doc.status === "pending" ? "secondary" : "destructive"
                      }>
                        {doc.status === "approved" ? "معتمد" :
                         doc.status === "pending" ? "قيد المراجعة" : "مرفوض"}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => window.open(doc.document_url, '_blank')}
                    >
                      عرض المستند
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-4">
              <Button
                variant="destructive"
                onClick={() => handleVerification('rejected')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "رفض"}
              </Button>
              <Button
                onClick={() => handleVerification('approved')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "اعتماد"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}