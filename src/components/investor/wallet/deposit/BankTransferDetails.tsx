import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
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

  if (!bankDetails) {
    return (
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          لم يتم العثور على معلومات بنكية. يرجى التواصل مع الدعم الفني.
        </AlertDescription>
      </Alert>
    )
  }

  const bankFields = [
    { label: "اسم البنك", value: bankDetails.bank_name },
    { label: "اسم الحساب", value: bankDetails.account_name },
    { label: "رمز السويفت (SWIFT)", value: bankDetails.swift },
    { label: "رقم الآيبان (IBAN)", value: bankDetails.iban }
  ]

  return (
    <div className="rounded-lg border p-4 space-y-4 bg-muted/50">
      {bankFields.map((field) => (
        <div key={field.label} className="space-y-2">
          <Label className="text-sm text-muted-foreground">{field.label}</Label>
          <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
            <span className="font-mono text-muted-foreground">{field.value}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(field.value)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}