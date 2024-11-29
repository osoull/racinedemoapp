import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BankAccountForm } from "./bank-accounts/BankAccountForm"
import { BankAccountItem } from "./bank-accounts/BankAccountItem"

export function BankAccountSettings() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const { data: bankAccounts, refetch } = useQuery({
    queryKey: ['platform_bank_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_bank_accounts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  const handleSubmit = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('platform_bank_accounts')
        .insert([{
          ...formData,
          is_active: true
        }])

      if (error) throw error

      toast({
        title: "تم الحفظ",
        description: "تم حفظ معلومات الحساب البنكي بنجاح",
      })
      
      setIsEditing(false)
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
            <BankAccountItem 
              key={account.id} 
              account={account}
              onToggleStatus={toggleAccountStatus}
            />
          ))}

          {isEditing ? (
            <BankAccountForm
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
            />
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