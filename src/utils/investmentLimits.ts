import { supabase } from "@/integrations/supabase/client";

export type InvestmentLimits = {
  minAmount: number;
  basicInvestorProjectLimit: number;
  basicInvestorAnnualLimit: number;
};

export const getInvestmentLimits = async (): Promise<InvestmentLimits> => {
  return {
    minAmount: 1000,
    basicInvestorProjectLimit: 20000,
    basicInvestorAnnualLimit: 100000,
  };
};

export const validateInvestmentAmount = async (
  amount: number,
  investorType: 'basic' | 'qualified',
  userId: string
): Promise<{ isValid: boolean; message?: string }> => {
  const limits = await getInvestmentLimits();

  if (amount < limits.minAmount) {
    return {
      isValid: false,
      message: `الحد الأدنى للاستثمار هو ${limits.minAmount} ريال`
    };
  }

  if (investorType === 'basic') {
    if (amount > limits.basicInvestorProjectLimit) {
      return {
        isValid: false,
        message: `الحد الأقصى للاستثمار في المشروع الواحد هو ${limits.basicInvestorProjectLimit} ريال للمستثمر غير المؤهل`
      };
    }

    // Check annual limit
    const { data: annualInvestments, error } = await supabase
      .from('investments')
      .select('amount')
      .eq('investor_id', userId)
      .gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString());

    if (error) throw error;

    const currentAnnualTotal = annualInvestments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
    if (currentAnnualTotal + amount > limits.basicInvestorAnnualLimit) {
      return {
        isValid: false,
        message: `الحد الأقصى للاستثمار السنوي هو ${limits.basicInvestorAnnualLimit} ريال للمستثمر غير المؤهل`
      };
    }
  }

  return { isValid: true };
};