import { z } from "zod";

export const fundingRequestSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  category: z.string().min(1, "تصنيف المشروع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  campaign_duration: z.number().min(1, "مدة الحملة مطلوبة"),
  description: z.string().min(50, "يجب أن يكون الوصف 50 حرفاً على الأقل"),
  fund_usage_plan: z.string().min(50, "يجب أن تكون خطة استخدام التمويل 50 حرفاً على الأقل"),
  business_plan: z.string().optional(),
  financial_statements: z.string().optional(),
  additional_documents: z.string().optional(),
});

export type FundingRequestFormData = z.infer<typeof fundingRequestSchema>;