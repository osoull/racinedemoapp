import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { WalletTransactions } from "./WalletTransactions"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function TransactionManagement() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
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

      // Calculate fee summaries
      const feeSummary = transactionsData.reduce((acc, transaction) => {
        if (transaction.fee_type && transaction.fee_amount) {
          if (!acc[transaction.fee_type]) {
            acc[transaction.fee_type] = 0;
          }
          acc[transaction.fee_type] += transaction.fee_amount;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        transactions: transactionsData,
        feeSummary
      };
    }
  });

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
            <WalletTransactions 
              transactions={transactions?.transactions} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="pending">
            <WalletTransactions 
              transactions={transactions?.transactions.filter(t => t.status === 'pending')} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="completed">
            <WalletTransactions 
              transactions={transactions?.transactions.filter(t => t.status === 'completed')} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <WalletTransactions 
              transactions={transactions?.transactions.filter(t => t.status === 'cancelled')} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}