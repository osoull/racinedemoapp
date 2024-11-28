import { supabase } from "@/integrations/supabase/client";

export async function getUserInvestmentTotal(userId: string): Promise<number> {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "investment")
      .eq("status", "completed");

    if (error) throw error;

    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  } catch (error) {
    console.error("Error fetching user investment total:", error);
    return 0;
  }
}

export const INVESTMENT_LIMITS = {
  basic_investor: {
    min: 1000,
    max: 50000,
  },
  qualified_investor: {
    min: 50000,
    max: Infinity,
  },
};

export function validateInvestmentAmount(
  amount: number,
  userType: string,
  currentTotal: number
): { valid: boolean; message?: string } {
  const limits = INVESTMENT_LIMITS[userType as keyof typeof INVESTMENT_LIMITS];
  
  if (!limits) {
    return { valid: false, message: "نوع المستثمر غير صالح" };
  }

  if (amount < limits.min) {
    return {
      valid: false,
      message: `الحد الأدنى للاستثمار هو ${limits.min} ريال`,
    };
  }

  if (amount > limits.max) {
    return {
      valid: false,
      message: `الحد الأقصى للاستثمار هو ${limits.max} ريال`,
    };
  }

  const newTotal = currentTotal + amount;
  if (userType === "basic_investor" && newTotal > limits.max) {
    return {
      valid: false,
      message: `لا يمكن تجاوز الحد الأقصى للاستثمار الكلي وهو ${limits.max} ريال`,
    };
  }

  return { valid: true };
}