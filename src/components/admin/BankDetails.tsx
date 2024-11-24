import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Copy, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useBankDetails } from "@/hooks/useBankDetails"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"

export default function BankDetails() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { data: bankDetails, isLoading, refetch } = useBankDetails()
  const [isEditing, setIsEditing] = useState(false)
  const [editedDetails, setEditedDetails] = useState({
    bank_name: "",
    account_name: "",
    swift: "",
    iban: ""
  })

  const startEditing = () => {
    if (bankDetails) {
      setEditedDetails(bankDetails)
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ 
          setting_value: editedDetails,
          last_updated_by: user?.id
        })
        .eq('setting_key', 'platform_bank_details')

      if (error) throw error

      await refetch()
      setIsEditing(false)
      toast({
        title: "تم التحديث",
        description: "تم تحديث المعلومات البنكية بنجاح"
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المعلومات البنكية",
        variant: "destructive"
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "تم النسخ",
      description: "تم نسخ النص إلى الحافظة"
    })
  }

  if (isLoading) {
    return <div>جاري التحميل...</div>
  }

  if (!bankDetails && !isEditing) {
    return <div>لا توجد معلومات بنكية</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            الحساب البنكي
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={startEditing}>
              <Edit2 className="h-4 w-4 ml-2" />
              تعديل
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 ml-2" />
              حفظ
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">اسم البنك</label>
              {isEditing ? (
                <Input
                  value={editedDetails.bank_name}
                  onChange={(e) => setEditedDetails({
                    ...editedDetails,
                    bank_name: e.target.value
                  })}
                />
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{bankDetails?.bank_name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(bankDetails?.bank_name || "")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">اسم الحساب</label>
              {isEditing ? (
                <Input
                  value={editedDetails.account_name}
                  onChange={(e) => setEditedDetails({
                    ...editedDetails,
                    account_name: e.target.value
                  })}
                />
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{bankDetails?.account_name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(bankDetails?.account_name || "")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">رمز السويفت (SWIFT)</label>
              {isEditing ? (
                <Input
                  value={editedDetails.swift}
                  onChange={(e) => setEditedDetails({
                    ...editedDetails,
                    swift: e.target.value
                  })}
                />
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-mono">{bankDetails?.swift}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(bankDetails?.swift || "")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">رقم الآيبان (IBAN)</label>
              {isEditing ? (
                <Input
                  value={editedDetails.iban}
                  onChange={(e) => setEditedDetails({
                    ...editedDetails,
                    iban: e.target.value
                  })}
                />
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-mono">{bankDetails?.iban}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(bankDetails?.iban || "")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}