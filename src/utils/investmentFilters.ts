import { Investment, InvestmentFilters } from "@/types/investment"

export function filterInvestments(investments: Investment[] | undefined, filters: InvestmentFilters): Investment[] {
  if (!investments) return []
  
  return investments.filter(investment => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const investorName = `${investment.user.first_name} ${investment.user.last_name}`.toLowerCase()
      const opportunityTitle = investment.funding_request.title.toLowerCase()
      
      if (!investorName.includes(searchLower) && 
          !opportunityTitle.includes(searchLower) && 
          !investment.id.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    if (filters.status && investment.status !== filters.status) {
      return false
    }

    if (filters.investor && investment.user.id !== filters.investor) {
      return false
    }

    if (filters.opportunity && investment.funding_request.id !== filters.opportunity) {
      return false
    }

    if (filters.dateRange?.from) {
      const investmentDate = new Date(investment.created_at)
      if (investmentDate < filters.dateRange.from || 
          (filters.dateRange.to && investmentDate > filters.dateRange.to)) {
        return false
      }
    }

    return true
  })
}