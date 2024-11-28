import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Transaction } from "@/types/supabase"

export function TransactionManagement() {
  const [currentTab, setCurrentTab] = useState("all")

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", currentTab],
    queryFn: async () => {
      const query = supabase
        .from('transactions')
        .select(`
          *,
          user:profiles(first_name, last_name),
          investment:funding_requests(
            amount,
            project:funding_requests(title)
          )
        `)
        .order('created_at', { ascending: false })

      if (currentTab !== "all") {
        query.eq('status', currentTab)
      }

      const { data, error } = await query

      if (error) throw error
      return data as unknown as Transaction[]
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
      <TabsList>
        <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
        <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
        <TabsTrigger value="completed">مكتملة</TabsTrigger>
        <TabsTrigger value="failed">فاشلة</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div>
          <h2 className="text-xl font-bold">جميع المعاملات</h2>
          <ul>
            {transactions?.map(transaction => (
              <li key={transaction.id} className="border-b py-4">
                <p>المستخدم: {transaction.user?.first_name} {transaction.user?.last_name}</p>
                <p>المبلغ: {transaction.amount}</p>
                <p>الحالة: {transaction.status}</p>
                <p>التاريخ: {new Date(transaction.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="pending">
        <div>
          <h2 className="text-xl font-bold">المعاملات قيد الانتظار</h2>
          <ul>
            {transactions?.filter(tx => tx.status === "pending").map(transaction => (
              <li key={transaction.id} className="border-b py-4">
                <p>المستخدم: {transaction.user?.first_name} {transaction.user?.last_name}</p>
                <p>المبلغ: {transaction.amount}</p>
                <p>الحالة: {transaction.status}</p>
                <p>التاريخ: {new Date(transaction.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="completed">
        <div>
          <h2 className="text-xl font-bold">المعاملات المكتملة</h2>
          <ul>
            {transactions?.filter(tx => tx.status === "completed").map(transaction => (
              <li key={transaction.id} className="border-b py-4">
                <p>المستخدم: {transaction.user?.first_name} {transaction.user?.last_name}</p>
                <p>المبلغ: {transaction.amount}</p>
                <p>الحالة: {transaction.status}</p>
                <p>التاريخ: {new Date(transaction.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="failed">
        <div>
          <h2 className="text-xl font-bold">المعاملات الفاشلة</h2>
          <ul>
            {transactions?.filter(tx => tx.status === "failed").map(transaction => (
              <li key={transaction.id} className="border-b py-4">
                <p>المستخدم: {transaction.user?.first_name} {transaction.user?.last_name}</p>
                <p>المبلغ: {transaction.amount}</p>
                <p>الحالة: {transaction.status}</p>
                <p>التاريخ: {new Date(transaction.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  )
}
