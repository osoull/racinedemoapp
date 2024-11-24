import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { BankDetailsData } from "@/hooks/useBankDetails"

interface BankTransferDetailsProps {
  bankDetails: BankDetailsData | undefined
  isLoading: boolean
  error: Error | null
}

export function BankTransferDetails({ bankDetails, isLoading, error }: BankTransferDetailsProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "تم النسخ",
      description: "تم نسخ النص إلى الحافظة"
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          حدث خطأ أثناء تحميل المعلومات البنكية
        </AlertDescription>
      </Alert>
    )
  }

  if (!bankDetails) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          لا توجد معلومات بنكية متاحة
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="rounded-lg border p-4 space-y-4 bg-gray-50">
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">اسم البنك</Label>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
          <span className="font-medium">{bankDetails.bank_name}</span>
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
        <Label className="text-sm text-muted-foreground">اسم الحساب</Label>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
          <span className="font-medium">{bankDetails.account_name}</span>
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
        <Label className="text-sm text-muted-foreground">رمز السويفت (SWIFT)</Label>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
          <span className="font-mono font-medium">{bankDetails.swift}</span>
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
        <Label className="text-sm text-muted-foreground">رقم الآيبان (IBAN)</Label>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
          <span className="font-mono font-medium">{bankDetails.iban}</span>
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
  )
}