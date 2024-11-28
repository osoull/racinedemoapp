import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "../transaction/TransactionList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function TransactionManagement() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
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

      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إدارة المعاملات</h2>
        <p className="text-muted-foreground">
          مراقبة وإدارة المعاملات المالية
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
              <TabsTrigger value="pending">قيد المعالجة</TabsTrigger>
              <TabsTrigger value="completed">مكتملة</TabsTrigger>
              <TabsTrigger value="cancelled">ملغاة</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TransactionList 
                transactions={transactions} 
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="pending">
              <TransactionList 
                transactions={transactions?.filter(t => t.status === 'pending')} 
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="completed">
              <TransactionList 
                transactions={transactions?.filter(t => t.status === 'completed')} 
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="cancelled">
              <TransactionList 
                transactions={transactions?.filter(t => t.status === 'cancelled')} 
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}