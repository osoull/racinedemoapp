import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BankAccount {
  id: string
  bank_name: string
  account_name: string
  account_number: string | null
  iban: string
  swift: string | null
  is_active: boolean
}

export function BankAccountSettings() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<BankAccount>>({})

  const { data: bankAccounts, refetch } = useQuery({
    queryKey: ['platform_bank_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_bank_accounts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as BankAccount[]
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('platform_bank_accounts')
        .insert([{
          bank_name: formData.bank_name,
          account_name: formData.account_name,
          account_number: formData.account_number,
          iban: formData.iban,
          swift: formData.swift,
          is_active: true
        }])

      if (error) throw error

      toast({
        title: "تم الحفظ",
        description: "تم حفظ معلومات الحساب البنكي بنجاح",
      })
      
      setIsEditing(false)
      setFormData({})
      refetch()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ معلومات الحساب البنكي",
        variant: "destructive",
      })
    }
  }

  const toggleAccountStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('platform_bank_accounts')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الحساب البنكي بنجاح",
      })
      
      refetch()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الحساب البنكي",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>الحسابات البنكية</CardTitle>
          <CardDescription>
            إدارة الحسابات البنكية للمنصة التي يمكن للمستخدمين الدفع إليها
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bankAccounts?.map((account) => (
            <div key={account.id} className="p-4 border rounded-lg mb-4">
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
                    onCheckedChange={() => toggleAccountStatus(account.id, account.is_active)}
                  />
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم الحساب:</span>
                  <span>{account.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IBAN:</span>
                  <span dir="ltr">{account.iban}</span>
                </div>
                {account.swift && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SWIFT:</span>
                    <span>{account.swift}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bank_name">اسم البنك</Label>
                  <Input
                    id="bank_name"
                    value={formData.bank_name || ''}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account_name">اسم الحساب</Label>
                  <Input
                    id="account_name"
                    value={formData.account_name || ''}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account_number">رقم الحساب</Label>
                  <Input
                    id="account_number"
                    value={formData.account_number || ''}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={formData.iban || ''}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="swift">SWIFT</Label>
                  <Input
                    id="swift"
                    value={formData.swift || ''}
                    onChange={(e) => setFormData({ ...formData, swift: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">حفظ</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setIsEditing(false)
                  setFormData({})
                }}>
                  إلغاء
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="mt-4">
              إضافة حساب بنكي جديد
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}