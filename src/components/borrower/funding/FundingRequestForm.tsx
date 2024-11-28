import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

const fundingRequestSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  funding_goal: z.number().min(1, "هدف التمويل مطلوب"),
  campaign_duration: z.number().min(1, "مدة الحملة مطلوبة"),
  fund_usage_plan: z.array(z.object({
    item: z.string(),
    amount: z.number()
  }))
})

type FundingRequestFormData = z.infer<typeof fundingRequestSchema>

export function FundingRequestForm() {
  const { user } = useAuth()
  const form = useForm<FundingRequestFormData>({
    resolver: zodResolver(fundingRequestSchema),
    defaultValues: {
      fund_usage_plan: [{ item: "", amount: 0 }]
    }
  })

  const onSubmit = async (data: FundingRequestFormData) => {
    try {
      const { error } = await supabase
        .from("funding_requests")
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          funding_goal: data.funding_goal,
          campaign_duration: data.campaign_duration,
          fund_usage_plan: data.fund_usage_plan,
          owner_id: user?.id,
          status: "draft"
        })

      if (error) throw error

      toast.success("تم حفظ طلب التمويل بنجاح")
      form.reset()
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ طلب التمويل")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label htmlFor="title">العنوان</label>
          <input {...form.register("title")} id="title" />
          {form.formState.errors.title && <p>{form.formState.errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description">الوصف</label>
          <textarea {...form.register("description")} id="description" />
          {form.formState.errors.description && <p>{form.formState.errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="category">الفئة</label>
          <input {...form.register("category")} id="category" />
          {form.formState.errors.category && <p>{form.formState.errors.category.message}</p>}
        </div>
        <div>
          <label htmlFor="funding_goal">هدف التمويل</label>
          <input type="number" {...form.register("funding_goal")} id="funding_goal" />
          {form.formState.errors.funding_goal && <p>{form.formState.errors.funding_goal.message}</p>}
        </div>
        <div>
          <label htmlFor="campaign_duration">مدة الحملة</label>
          <input type="number" {...form.register("campaign_duration")} id="campaign_duration" />
          {form.formState.errors.campaign_duration && <p>{form.formState.errors.campaign_duration.message}</p>}
        </div>
        <div>
          <label htmlFor="fund_usage_plan">خطة استخدام الأموال</label>
          {form.watch("fund_usage_plan").map((item, index) => (
            <div key={index}>
              <input {...form.register(`fund_usage_plan.${index}.item`)} placeholder="العنصر" />
              <input type="number" {...form.register(`fund_usage_plan.${index}.amount`)} placeholder="المبلغ" />
            </div>
          ))}
        </div>
        <Button type="submit">حفظ الطلب</Button>
      </form>
    </Form>
  )
}