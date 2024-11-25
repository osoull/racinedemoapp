import { Tables } from "@/integrations/supabase/types"

type Commission = Tables<"commissions">

export const calculateFees = (
  amount: number,
  commissions: Commission[],
  userType: string = 'basic_investor'
) => {
  const fees = {
    admin: 0,
    collection: 0,
    investor: 0,
    total: 0
  }

  commissions.forEach(commission => {
    const rate = commission.rate / 100
    switch (commission.commission_type) {
      case 'admin_fee':
        fees.admin = amount * rate
        break
      case 'collection_fee':
        fees.collection = amount * rate
        break
      case 'basic_investor_fee':
        if (userType === 'basic_investor') {
          fees.investor = amount * rate
        }
        break
      case 'qualified_investor_fee':
        if (userType === 'qualified_investor') {
          fees.investor = amount * rate
        }
        break
    }
  })

  fees.total = fees.admin + fees.collection + fees.investor
  return fees
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}