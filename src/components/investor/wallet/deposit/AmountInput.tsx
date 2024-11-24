import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AmountInputProps {
  amount: string
  setAmount: (value: string) => void
}

export function AmountInput({ amount, setAmount }: AmountInputProps) {
  return (
    <div className="space-y-2">
      <Label>المبلغ</Label>
      <Input
        type="number"
        placeholder="أدخل المبلغ"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
  )
}