export type ProjectFormValues = {
  title: string;
  description: string;
  funding_goal: number;
  min_investment: number;
  classification: 'تمويل مشاريع طرف ثاني' | 'تمويل الفواتير' | 'تمويل رأس المال العامل' | 'تمويل التوسع' | 'تمويل المشاريع العقارية';
  shariahCompliant: boolean;
};

export type DocumentType = 'presentation' | 'feasibility' | 'financial';