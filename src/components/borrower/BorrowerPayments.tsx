import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { DataTable } from "@/components/ui/data-table"
import { Loader2 } from "lucide-react"
import { columns } from "./payments/columns"

export function BorrowerPayments() {
  const { user } = useAuth()

  const { data: payments, isLoading } = useQuery({
    queryKey: ["borrower-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id,
          amount,
          status,
          created_at,
          type,
          fee_amount
        `)
        .eq("user_id", user?.id)
        .in("type", ["payment", "borrower_payment"])
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">المدفوعات</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>سجل المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={payments || []} />
        </CardContent>
      </Card>
    </div>
  )
}