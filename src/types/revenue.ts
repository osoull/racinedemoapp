export interface FeeData {
  id: string;
  transaction_id: string;
  commission_id: string;
  amount: number;
  fee_amount: number;
  fee_type: string;
  created_at: string | null;
  updated_at: string | null;
  transaction: {
    created_at: string;
  };
}

export interface RevenueStats {
  currentTotal: number;
  lastYearTotal: number;
  yearlyChange: number;
  fees: FeeData[];
}