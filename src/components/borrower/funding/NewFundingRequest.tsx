import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { CategorySelect } from "./CategorySelect"

const fundingRequestSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  description: z.string().min(50, "يجب أن يكون الوصف 50 حرفاً على الأقل"),
  category: z.string().min(1, "تصنيف المشروع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المطلوب يجب أن يكون أكبر من 1000 ريال"),
  campaign_duration: z.number().min(30, "مدة الحملة يجب أن تكون 30 يوماً على الأقل").max(90, "مدة الحملة يجب أن لا تتجاوز 90 يوماً"),
})

export function NewFundingRequest() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof fundingRequestSchema>>({
    resolver: zodResolver(fundingRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      funding_goal: 1000,
      campaign_duration: 30,
    },
  })

  const onSubmit = async (values: z.infer<typeof fundingRequestSchema>) => {
    try {
      const { error } = await supabase.from("funding_requests").insert({
        owner_id: user?.id,
        title: values.title,
        description: values.description,
        category: values.category,
        funding_goal: values.funding_goal,
        campaign_duration: values.campaign_duration,
        fund_usage_plan: [],
        status: "draft"
      })

      if (error) throw error

      toast({
        title: "تم حفظ الطلب",
        description: "تم حفظ طلب التمويل بنجاح",
      })

      navigate("/borrower/funding-requests")
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ طلب التمويل",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">طلب تمويل جديد</h2>
        <p className="text-muted-foreground">
          قم بتعبئة النموذج التالي لإنشاء طلب تمويل جديد
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المشروع</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان المشروع *</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CategorySelect control={form.control} />

              <FormField
                control={form.control}
                name="funding_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ المطلوب (ريال) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="text-right"
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campaign_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مدة الحملة (بالأيام) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="text-right"
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف المشروع *</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} className="text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/borrower/funding-requests")}
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ الطلب</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}