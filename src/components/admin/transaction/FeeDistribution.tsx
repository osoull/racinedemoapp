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

  const investmentTransactions = transactions?.filter(t => 
    t.type === 'investment'
  ) || []

  const calculateFees = (amount: number) => {
    const fees = {
      admin: 0,
      collection: 0,
      basic_investor: 0,
      qualified_investor: 0
    }

    commissions?.forEach(commission => {
      switch (commission.commission_type) {
        case 'admin_fee':
          fees.admin = amount * (commission.rate / 100)
          break
        case 'collection_fee':
          fees.collection = amount * (commission.rate / 100)
          break
        case 'basic_investor_fee':
          fees.basic_investor = amount * (commission.rate / 100)
          break
        case 'qualified_investor_fee':
          fees.qualified_investor = amount * (commission.rate / 100)
          break
      }
    })

    return fees
  }

  const totalInvestments = investmentTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalFees = calculateFees(totalInvestments)

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
          {investmentTransactions.map(transaction => {
            const fees = calculateFees(transaction.amount)
            const netAmount = transaction.amount - 
              (fees.admin + fees.collection + fees.basic_investor + fees.qualified_investor)

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
                    <span className="text-muted-foreground">رسوم الإدارة:</span>
                    <span className="float-left">{formatCurrency(fees.admin)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">رسوم التحصيل:</span>
                    <span className="float-left">{formatCurrency(fees.collection)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">رسوم المستثمر الأساسي:</span>
                    <span className="float-left">{formatCurrency(fees.basic_investor)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">رسوم المستثمر المؤهل:</span>
                    <span className="float-left">{formatCurrency(fees.qualified_investor)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">صافي الاستثمار:</span>
                    <span className="float-left font-medium">{formatCurrency(netAmount)}</span>
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