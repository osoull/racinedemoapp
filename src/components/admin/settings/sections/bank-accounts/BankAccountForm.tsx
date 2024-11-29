import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BankAccountFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function BankAccountForm({ onSubmit, onCancel }: BankAccountFormProps) {
  const [formData, setFormData] = useState({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="bank_name">اسم البنك</Label>
          <Input
            id="bank_name"
            value={formData.bank_name || ''}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            required
            className="text-right"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="account_name">اسم الحساب</Label>
          <Input
            id="account_name"
            value={formData.account_name || ''}
            onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
            required
            className="text-right"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="account_number">رقم الحساب</Label>
          <Input
            id="account_number"
            value={formData.account_number || ''}
            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            className="text-right"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="iban">IBAN</Label>
          <Input
            id="iban"
            value={formData.iban || ''}
            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
            required
            className="text-right"
            dir="ltr"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="swift">SWIFT</Label>
          <Input
            id="swift"
            value={formData.swift || ''}
            onChange={(e) => setFormData({ ...formData, swift: e.target.value })}
            className="text-right"
            dir="ltr"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit">حفظ</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}