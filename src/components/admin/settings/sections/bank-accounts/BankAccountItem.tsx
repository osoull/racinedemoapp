import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface BankAccount {
  id: string
  bank_name: string
  account_name: string
  account_number: string | null
  iban: string
  swift: string | null
  is_active: boolean
}

interface BankAccountItemProps {
  account: BankAccount
  onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>
}

export function BankAccountItem({ account, onToggleStatus }: BankAccountItemProps) {
  return (
    <div className="p-4 border rounded-lg mb-4" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">{account.bank_name}</h3>
          <p className="text-sm text-muted-foreground">{account.account_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`active-${account.id}`}>نشط</Label>
          <Switch
            id={`active-${account.id}`}
            checked={account.is_active}
            onCheckedChange={() => onToggleStatus(account.id, account.is_active)}
          />
        </div>
      </div>
      <div className="grid gap-2 text-sm">
        {account.account_number && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">رقم الحساب:</span>
            <span className="font-mono">{account.account_number}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">IBAN:</span>
          <span dir="ltr" className="font-mono tracking-wider">{account.iban}</span>
        </div>
        {account.swift && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">SWIFT:</span>
            <span dir="ltr" className="font-mono tracking-wider">{account.swift}</span>
          </div>
        )}
      </div>
    </div>
  )
}