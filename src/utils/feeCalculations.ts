import { Tables } from "@/integrations/supabase/types"
import { UserType } from "@/types/user"

type Commission = Tables<"commissions">

export const calculateFees = (
  amount: number,
  commissions: Commission[],
  userType: UserType = 'basic_investor'
) => {
  const fees = {
    admin: 0,
    collection: 0,
    investor: 0,
    funding_request: 0,
    total: 0
  }

  // Pour les investisseurs, on applique les frais d'investisseur selon leur type
  if (userType === 'basic_investor' || userType === 'qualified_investor') {
    const investorFeeType = userType === 'basic_investor' ? 'basic_investor_fee' : 'qualified_investor_fee'
    const investorFee = commissions.find(c => c.commission_type === investorFeeType)
    if (investorFee) {
      fees.investor = amount * (investorFee.rate / 100)
    }
    fees.total = fees.investor
  } 
  // Pour les emprunteurs, on applique les frais d'administration, de collection et de demande de financement
  else if (userType === 'borrower') {
    commissions.forEach(commission => {
      const rate = commission.rate / 100
      switch (commission.commission_type) {
        case 'admin_fee':
          fees.admin = amount * rate
          break
        case 'collection_fee':
          fees.collection = amount * rate
          break
        case 'funding_request':
          fees.funding_request = amount * rate
          break
      }
    })
    fees.total = fees.admin + fees.collection + fees.funding_request
  }

  return fees
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}

export const getFeeTypeLabel = (feeType: string): string => {
  switch (feeType) {
    case 'admin_fee':
      return 'رسوم إدارية'
    case 'collection_fee':
      return 'رسوم تحصيل'
    case 'basic_investor_fee':
      return 'رسوم مستثمر أساسي'
    case 'qualified_investor_fee':
      return 'رسوم مستثمر مؤهل'
    case 'funding_request':
      return 'رسوم طلب التمويل'
    default:
      return feeType
  }
}

export const calculateTotalFees = (fees: { [key: string]: number }): number => {
  return Object.values(fees).reduce((sum, fee) => sum + fee, 0)
}

export const formatFeeAmount = (amount: number, rate: number): string => {
  const feeAmount = amount * (rate / 100)
  return `${formatCurrency(feeAmount)} (${rate}%)`
}