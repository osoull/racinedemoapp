import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, FileText } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

const REQUIRED_DOCUMENTS = [
  {
    type: "commercial_register",
    label: "السجل التجاري",
    description: "نسخة حديثة من السجل التجاري (إلزامي)"
  },
  {
    type: "tax_certificate",
    label: "شهادة الزكاة والضريبة",
    description: "شهادة تسجيل ضريبة القيمة المضافة (إلزامي)"
  },
  {
    type: "articles_of_association",
    label: "عقد التأسيس",
    description: "نسخة من عقد تأسيس الشركة (إلزامي)"
  },
  {
    type: "national_address",
    label: "العنوان الوطني",
    description: "شهادة العنوان الوطني للشركة (إلزامي)"
  },
  {
    type: "audited_financials",
    label: "القوائم المالية المدققة",
    description: "القوائم المالية المدققة لآخر سنتين (إلزامي)"
  }
]

export function DocumentUploadSection() {
  const [uploading, setUploading] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      setUploading(documentType)
      
      const fileExt = file.name.split(".").pop()
      const filePath = `${user?.id}/${documentType}.${fileExt}`

      // Upload file to Storage
      const { error: uploadError } = await supabase.storage
        .from("kyc-documents")
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("kyc-documents")
        .getPublicUrl(filePath)

      // Create document record
      const { error: dbError } = await supabase
        .from("kyc_documents")
        .insert({
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

    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء رفع المستند",
        variant: "destructive"
      })
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">المستندات المطلوبة</h3>
        <p className="text-sm text-muted-foreground">
          يرجى رفع جميع المستندات التالية للتحقق من هوية الشركة
        </p>
      </div>

      <div className="grid gap-4">
        {REQUIRED_DOCUMENTS.map((doc) => (
          <Card key={doc.type} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{doc.label}</h4>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
              </div>
              <Button variant="outline" className="relative">
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
                {uploading === doc.type ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Upload className="h-4 w-4 ml-2" />
                )}
                رفع المستند
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}