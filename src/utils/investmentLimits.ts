import { supabase } from "@/integrations/supabase/client";

export type InvestmentLimits = {
  minAmount: number;
  basicInvestorProjectLimit: number;
  basicInvestorAnnualLimit: number;
};

export const getInvestmentLimits = async (): Promise<InvestmentLimits> => {
  const { data: settings, error } = await supabase
    .from('platform_settings')
    .select('setting_key, setting_value')
    .in('setting_key', [
      'min_investment_amount',
      'basic_investor_single_project_limit',
      'basic_investor_annual_limit'
    ]);

  if (error) throw error;

  const limits: InvestmentLimits = {
    minAmount: 1000, // Default value
    basicInvestorProjectLimit: 20000, // Default value
    basicInvestorAnnualLimit: 100000, // Default value
  };

  settings?.forEach(setting => {
    switch (setting.setting_key) {
      case 'min_investment_amount':
        limits.minAmount = Number(setting.setting_value);
        break;
      case 'basic_investor_single_project_limit':
        limits.basicInvestorProjectLimit = Number(setting.setting_value);
        break;
      case 'basic_investor_annual_limit':
        limits.basicInvestorAnnualLimit = Number(setting.setting_value);
        break;
    }
  });

  return limits;
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