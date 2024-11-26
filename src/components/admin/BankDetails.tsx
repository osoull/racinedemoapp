import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Copy, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

const BankDetailsField = ({ 
  label, 
  value, 
  isEditing, 
  onChange, 
  onCopy 
}: { 
  label: string
  value: string
  isEditing: boolean
  onChange?: (value: string) => void
  onCopy: () => void
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-muted-foreground">
      {label} <span className="text-red-500">*</span>
    </label>
    {isEditing ? (
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="font-mono"
        required
      />
    ) : (
      <div className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/50">
        <span className="font-mono text-muted-foreground">{value}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    )}
  </div>
)

export default function BankDetails() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedDetails, setEditedDetails] = useState({
    bank_name: "",
    account_name: "",
    swift: "",
    iban: ""
  })

  const { data: bankDetails, isLoading, refetch } = useQuery({
    queryKey: ['platform_bank_account'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('is_primary', true)
        .single()

      if (error) throw error
      return data
    }
  })

  const startEditing = () => {
    if (bankDetails) {
      setEditedDetails(bankDetails)
    } else {
      setEditedDetails({
        bank_name: "",
        account_name: "",
        swift: "",
        iban: ""
      })
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('bank_accounts')
        .upsert({ 
          ...editedDetails,
          is_primary: true,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })

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

  return (
    <Card className="bg-gradient-to-br from-card/50 to-card border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BankDetailsField
              label="اسم البنك"
              value={isEditing ? editedDetails.bank_name : bankDetails?.bank_name || ""}
              isEditing={isEditing}
              onChange={(value) => setEditedDetails({ ...editedDetails, bank_name: value })}
              onCopy={() => copyToClipboard(bankDetails?.bank_name || "")}
            />
            <BankDetailsField
              label="اسم الحساب"
              value={isEditing ? editedDetails.account_name : bankDetails?.account_name || ""}
              isEditing={isEditing}
              onChange={(value) => setEditedDetails({ ...editedDetails, account_name: value })}
              onCopy={() => copyToClipboard(bankDetails?.account_name || "")}
            />
            <BankDetailsField
              label="رمز السويفت (SWIFT)"
              value={isEditing ? editedDetails.swift : bankDetails?.swift || ""}
              isEditing={isEditing}
              onChange={(value) => setEditedDetails({ ...editedDetails, swift: value })}
              onCopy={() => copyToClipboard(bankDetails?.swift || "")}
            />
            <BankDetailsField
              label="رقم الآيبان (IBAN)"
              value={isEditing ? editedDetails.iban : bankDetails?.iban || ""}
              isEditing={isEditing}
              onChange={(value) => setEditedDetails({ ...editedDetails, iban: value })}
              onCopy={() => copyToClipboard(bankDetails?.iban || "")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}