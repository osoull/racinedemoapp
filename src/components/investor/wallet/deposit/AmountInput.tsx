import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AmountInputProps {
  amount: string
  setAmount: (value: string) => void
  error?: string
}

export function AmountInput({ amount, setAmount, error }: AmountInputProps) {
  return (
    <div className="space-y-2">
      <Label>المبلغ</Label>
      <Input
        type="number"
        placeholder="أدخل المبلغ"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}