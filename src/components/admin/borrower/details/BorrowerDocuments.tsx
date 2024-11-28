import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface BorrowerDocumentsProps {
  borrower: any // Type to be defined based on your data structure
}

export function BorrowerDocuments({ borrower }: BorrowerDocumentsProps) {
  const { toast } = useToast()

  const handleVerifyDocument = async (documentId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('kyc_documents')
        .update({ 
          status,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', documentId)

      if (error) throw error

      toast({
        title: "تم تحديث حالة المستند",
        description: status === 'approved' ? "تم اعتماد المستند بنجاح" : "تم رفض المستند",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة المستند",
        variant: "destructive",
      })
    }
  }

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">معتمد</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">مرفوض</Badge>
      default:
        return <Badge className="bg-yellow-500">قيد المراجعة</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>المستندات المطلوبة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {borrower.kyc_documents?.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6" />
                <div>
                  <p className="font-medium">{doc.document_type}</p>
                  <p className="text-sm text-muted-foreground">
                    تم الرفع: {new Date(doc.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getDocumentStatusBadge(doc.status)}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.document_url)}
                >
                  <Download className="h-4 w-4" />
                </Button>

                {doc.status === 'pending' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerifyDocument(doc.id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerifyDocument(doc.id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}