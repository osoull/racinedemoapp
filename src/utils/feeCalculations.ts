import { Tables } from "@/integrations/supabase/types"

type Commission = Tables<"commissions">

export const calculateFees = (
  amount: number,
  commissions: Commission[],
  userType: string = 'basic'
) => {
  const fees = {
    admin: 0,
    collection: 0,
    investor: 0,
    total: 0
  }

  // Pour les investisseurs, on n'applique que les frais d'investisseur correspondant à leur type
  if (userType === 'basic' || userType === 'qualified') {
    const investorFeeType = userType === 'basic' ? 'basic_investor_fee' : 'qualified_investor_fee'
    const investorFee = commissions.find(c => c.commission_type === investorFeeType)
    if (investorFee) {
      fees.investor = amount * (investorFee.rate / 100)
    }
    fees.total = fees.investor
  } 
  // Pour les emprunteurs, on applique les frais d'administration et de collection
  else {
    commissions.forEach(commission => {
      const rate = commission.rate / 100
      switch (commission.commission_type) {
        case 'admin_fee':
          fees.admin = amount * rate
          break
        case 'collection_fee':
          fees.collection = amount * rate
          break
      }
    })
    fees.total = fees.admin + fees.collection
  }

  return fees
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}