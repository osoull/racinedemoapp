import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { WalletTransactions } from "./WalletTransactions"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function TransactionManagement() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      // Récupérer les transactions avec les frais associés
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          user:profiles(first_name, last_name),
          investment:investments(
            amount,
            project:projects(title)
          )
        `)
        .order('created_at', { ascending: false })

      if (transactionsError) throw transactionsError

      // Récupérer les frais pour chaque transaction
      const { data: feesData, error: feesError } = await supabase
        .from('fee_tracking')
        .select('*')
        .in('transaction_id', transactionsData.map(t => t.id))

      if (feesError) throw feesError

      // Associer les frais aux transactions
      const transactionsWithFees = transactionsData.map(transaction => {
        const transactionFees = feesData.filter(f => f.transaction_id === transaction.id)
        const fees = {
          admin: transactionFees.find(f => f.fee_type === 'admin_fee')?.fee_amount || 0,
          collection: transactionFees.find(f => f.fee_type === 'collection_fee')?.fee_amount || 0,
          investor: transactionFees.find(f => 
            f.fee_type === 'basic_investor_fee' || f.fee_type === 'qualified_investor_fee'
          )?.fee_amount || 0,
          total: transactionFees.reduce((sum, fee) => sum + fee.fee_amount, 0)
        }
        return { ...transaction, fees }
      })

      return transactionsWithFees
    }
  })

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المعاملات</h2>
          <p className="text-muted-foreground">
            مراقبة وإدارة المعاملات المالية
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
            <TabsTrigger value="pending">قيد المعالجة</TabsTrigger>
            <TabsTrigger value="completed">مكتملة</TabsTrigger>
            <TabsTrigger value="cancelled">ملغاة</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <WalletTransactions transactions={transactions} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="pending">
            <WalletTransactions 
              transactions={transactions?.filter(t => t.status === 'pending')} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="completed">
            <WalletTransactions 
              transactions={transactions?.filter(t => t.status === 'completed')} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <WalletTransactions 
              transactions={transactions?.filter(t => t.status === 'cancelled')} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}