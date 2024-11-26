import { Card } from "@/components/ui/card"
import { Tables } from "@/integrations/supabase/types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

type Transaction = Tables<"transactions"> & {
  user: { first_name: string; last_name: string } | null;
  investment: {
    amount: number;
    project: { title: string } | null;
  } | null;
}

interface FeeDistributionProps {
  transactions?: Transaction[]
  isLoading: boolean
}

export function FeeDistribution({ transactions, isLoading }: FeeDistributionProps) {
  const { data: commissions } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
      
      if (error) throw error
      return data
    },
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
  }

  if (isLoading) return <div>جاري التحميل...</div>

  const feeTransactions = transactions?.filter(t => 
    t.type === 'fee'
  ) || []

  const calculateFees = (transactions: Transaction[]) => {
    const fees = {
      admin: 0,
      collection: 0,
      basic_investor: 0,
      qualified_investor: 0
    }

    transactions.forEach(transaction => {
      if (transaction.fee_type === 'admin_fee') {
        fees.admin += transaction.fee_amount || 0
      } else if (transaction.fee_type === 'collection_fee') {
        fees.collection += transaction.fee_amount || 0
      } else if (transaction.fee_type === 'basic_investor_fee') {
        fees.basic_investor += transaction.fee_amount || 0
      } else if (transaction.fee_type === 'qualified_investor_fee') {
        fees.qualified_investor += transaction.fee_amount || 0
      }
    })

    return fees
  }

  const totalFees = calculateFees(feeTransactions)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">رسوم الإدارة</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees.admin)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">رسوم التحصيل</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees.collection)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">رسوم المستثمر الأساسي</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees.basic_investor)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">رسوم المستثمر المؤهل</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalFees.qualified_investor)}</p>
        </Card>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-medium mb-4">تفاصيل المعاملات الاستثمارية</h3>
        <div className="space-y-4">
          {feeTransactions.map(transaction => {
            return (
              <div key={transaction.id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      {transaction.investment?.project?.title || 'مشروع غير معروف'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.user ? 
                        `${transaction.user.first_name} ${transaction.user.last_name}` : 
                        'مستثمر غير معروف'
                      }
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">نوع الرسوم:</span>
                    <span className="float-left">
                      {transaction.fee_type === 'admin_fee' && 'رسوم إدارية'}
                      {transaction.fee_type === 'collection_fee' && 'رسوم تحصيل'}
                      {transaction.fee_type === 'basic_investor_fee' && 'رسوم مستثمر أساسي'}
                      {transaction.fee_type === 'qualified_investor_fee' && 'رسوم مستثمر مؤهل'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">مبلغ الرسوم:</span>
                    <span className="float-left">{formatCurrency(transaction.fee_amount || 0)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">المبلغ الإجمالي:</span>
                    <span className="float-left font-medium">{formatCurrency(transaction.amount)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}