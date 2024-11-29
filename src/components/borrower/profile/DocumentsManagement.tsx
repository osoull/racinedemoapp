import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Download } from "lucide-react"
import { useState } from "react"

const REQUIRED_DOCUMENTS = [
  {
    type: "commercial_register",
    label: "السجل التجاري",
    description: "نسخة حديثة من السجل التجاري"
  },
  {
    type: "tax_certificate",
    label: "شهادة الزكاة والضريبة",
    description: "شهادة تسجيل ضريبة القيمة المضافة"
  },
  {
    type: "articles_of_association",
    label: "عقد التأسيس",
    description: "نسخة من عقد تأسيس الشركة"
  },
  {
    type: "national_address",
    label: "العنوان الوطني",
    description: "شهادة العنوان الوطني للشركة"
  }
]

export function DocumentsManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [uploading, setUploading] = useState<string | null>(null)

  const { data: documents, refetch } = useQuery({
    queryKey: ["kyc-documents", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kyc_documents")
        .select("*")
        .eq("user_id", user?.id)

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      setUploading(documentType)
      
      const fileExt = file.name.split(".").pop()
      const filePath = `${user?.id}/${documentType}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("kyc-documents")
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("kyc-documents")
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase
        .from("kyc_documents")
        .upsert({
          user_id: user?.id,
          document_type: documentType,
          document_url: publicUrl,
          status: "pending"
        })

      if (dbError) throw dbError

      toast({
        title: "تم رفع المستند",
        description: "تم رفع المستند بنجاح وسيتم مراجعته قريباً"
      })

      refetch()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع المستند",
        variant: "destructive"
      })
    } finally {
      setUploading(null)
    }
  }

  const getDocumentStatus = (docType: string) => {
    const doc = documents?.find(d => d.document_type === docType)
    if (!doc) return null
    
    switch (doc.status) {
      case 'approved':
        return <Badge className="bg-green-500">معتمد</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">مرفوض</Badge>
      default:
        return <Badge className="bg-yellow-500">قيد المراجعة</Badge>
    }
  }

  const getDocumentUrl = (docType: string) => {
    return documents?.find(d => d.document_type === docType)?.document_url
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>المستندات المطلوبة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {REQUIRED_DOCUMENTS.map((doc) => (
            <div key={doc.type} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6" />
                <div>
                  <p className="font-medium">{doc.label}</p>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getDocumentStatus(doc.type)}
                
                {getDocumentUrl(doc.type) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(getDocumentUrl(doc.type))}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                <div className="relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, doc.type)
                    }}
                    disabled={uploading === doc.type}
                  />
                  <Button variant="outline" size="sm" disabled={uploading === doc.type}>
                    <Upload className="h-4 w-4 ml-2" />
                    رفع المستند
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}