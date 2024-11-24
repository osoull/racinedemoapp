import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Building2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface BankDetailsData {
  bank_name: string;
  account_name: string;
  swift: string;
  iban: string;
}

export default function BankDetails() {
  const { toast } = useToast()

  const { data: bankDetails, isLoading } = useQuery({
    queryKey: ['platform_bank_details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'platform_bank_details')
        .single()

      if (error) throw error
      
      // Explicitly cast the JSON data to BankDetailsData
      const bankData = data.setting_value as unknown as BankDetailsData
      return bankData
    }
  })

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

  if (!bankDetails) {
    return <div>لا توجد معلومات بنكية</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          الحساب البنكي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">اسم البنك</label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>{bankDetails.bank_name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(bankDetails.bank_name)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">اسم الحساب</label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>{bankDetails.account_name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(bankDetails.account_name)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">رمز السويفت (SWIFT)</label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-mono">{bankDetails.swift}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(bankDetails.swift)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">رقم الآيبان (IBAN)</label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-mono">{bankDetails.iban}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(bankDetails.iban)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}