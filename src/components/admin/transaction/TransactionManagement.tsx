import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { WalletTransactions } from "./WalletTransactions"
import { FeeDistribution } from "./FeeDistribution"
import { useEffect } from "react"
import { toast } from "sonner"

type Transaction = Tables<"transactions">

export function TransactionManagement() {
  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:profiles(first_name, last_name),
          investment:investments(
            amount,
            project:projects(title)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (Transaction & {
        user: { first_name: string; last_name: string } | null;
        investment: {
          amount: number;
          project: { title: string } | null;
        } | null;
      })[]
    },
  })

  useEffect(() => {
    const channel = supabase
      .channel('transaction-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'transactions' 
        }, 
        (payload) => {
          refetch()
          
          const status = payload.new.status
          const type = payload.new.type === 'deposit' ? 'الإيداع' : 'السحب'
          
          if (status === 'completed') {
            toast.success(`تم اعتماد عملية ${type}`)
          } else if (status === 'cancelled') {
            toast.error(`تم رفض عملية ${type}`)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المعاملات المالية</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wallets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="wallets">المحافظ والإيداعات</TabsTrigger>
            <TabsTrigger value="fees">توزيع الرسوم</TabsTrigger>
          </TabsList>

          <TabsContent value="wallets">
            <WalletTransactions transactions={transactions} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="fees">
            <FeeDistribution transactions={transactions} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}