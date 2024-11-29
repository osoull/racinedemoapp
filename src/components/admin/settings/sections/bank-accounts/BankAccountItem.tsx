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
    <div className="p-4 border rounded-lg bg-card shadow-sm" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{account.bank_name}</h3>
          <p className="text-sm text-muted-foreground">{account.account_name}</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Switch
            id={`active-${account.id}`}
            checked={account.is_active}
            onCheckedChange={() => onToggleStatus(account.id, account.is_active)}
          />
          <Label htmlFor={`active-${account.id}`} className="text-sm mr-2">
            نشط
          </Label>
        </div>
      </div>
      <div className="grid gap-2 text-sm">
        {account.account_number && (
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">رقم الحساب:</span>
            <span className="font-mono">{account.account_number}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">IBAN:</span>
          <span dir="ltr" className="font-mono tracking-wider">{account.iban}</span>
        </div>
        {account.swift && (
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">SWIFT:</span>
            <span dir="ltr" className="font-mono tracking-wider">{account.swift}</span>
          </div>
        )}
      </div>
    </div>
  )
}