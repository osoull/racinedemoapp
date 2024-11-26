import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransactionList } from "./TransactionList";

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
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      return transactionsData;
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
            <Card className="p-4">
              <TransactionList 
                transactions={transactions} 
                isLoading={isLoading} 
              />
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card className="p-4">
              <TransactionList 
                transactions={transactions?.filter(t => t.status === 'pending')} 
                isLoading={isLoading} 
              />
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="p-4">
              <TransactionList 
                transactions={transactions?.filter(t => t.status === 'completed')} 
                isLoading={isLoading} 
              />
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card className="p-4">
              <TransactionList 
                transactions={transactions?.filter(t => t.status === 'cancelled')} 
                isLoading={isLoading} 
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}