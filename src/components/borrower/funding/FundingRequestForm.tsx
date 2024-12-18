import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { BasicInfoStep } from "./steps/BasicInfoStep"
import { DocumentsStep } from "./steps/DocumentsStep"
import { PaymentStep } from "./steps/PaymentStep"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { FundingRequest } from "@/types/funding"

const formSchema = z.object({
  title: z.string().min(1, "عنوان المشروع مطلوب"),
  category: z.string().min(1, "تصنيف المشروع مطلوب"),
  funding_goal: z.number().min(1000, "المبلغ المستهدف يجب أن يكون أكبر من 1000 ريال"),
  campaign_duration: z.number().min(1, "مدة الحملة مطلوبة"),
  description: z.string().min(50, "يجب أن يكون الوصف 50 حرفاً على الأقل"),
  fund_usage_plan: z.string().min(50, "يجب أن تكون خطة استخدام التمويل 50 حرفاً على الأقل"),
  business_plan: z.string().optional(),
  financial_statements: z.string().optional(),
  additional_documents: z.string().optional(),
})

export interface FundingRequestFormProps {
  initialData?: FundingRequest;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FundingRequestForm({ initialData, onSuccess, onCancel }: FundingRequestFormProps) {
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      category: initialData.category,
      funding_goal: initialData.funding_goal,
      campaign_duration: initialData.campaign_duration,
      description: initialData.description,
      fund_usage_plan: initialData.fund_usage_plan,
    } : {
      title: "",
      category: "",
      funding_goal: 0,
      campaign_duration: 30,
      description: "",
      fund_usage_plan: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // Update existing request
        const { error } = await supabase
          .from("funding_requests")
          .update({
            title: values.title,
            category: values.category,
            funding_goal: values.funding_goal,
            campaign_duration: values.campaign_duration,
            description: values.description,
            fund_usage_plan: values.fund_usage_plan,
            status: "draft",
            completion_steps: {
              basic_info: true,
              documents: !!values.business_plan && !!values.financial_statements,
              payment: false,
            },
          })
          .eq("id", initialData.id)
          .eq("owner_id", user?.id)

        if (error) throw error
      } else {
        // Create new request
        const { data: request, error } = await supabase
          .from("funding_requests")
          .insert({
            owner_id: user?.id,
            title: values.title,
            category: values.category,
            funding_goal: values.funding_goal,
            campaign_duration: values.campaign_duration,
            description: values.description,
            fund_usage_plan: values.fund_usage_plan,
            status: "draft",
            completion_steps: {
              basic_info: true,
              documents: !!values.business_plan && !!values.financial_statements,
              payment: false,
            },
          })
          .select()
          .single()

        if (error) throw error

        if (values.business_plan || values.financial_statements || values.additional_documents) {
          const documents = []
          if (values.business_plan) {
            documents.push({
              request_id: request.id,
              document_type: "business_plan",
              document_url: values.business_plan,
            })
          }
          if (values.financial_statements) {
            documents.push({
              request_id: request.id,
              document_type: "financial_statements",
              document_url: values.financial_statements,
            })
          }
          if (values.additional_documents) {
            documents.push({
              request_id: request.id,
              document_type: "additional",
              document_url: values.additional_documents,
            })
          }

          const { error: docsError } = await supabase
            .from("funding_request_documents")
            .insert(documents)

          if (docsError) throw docsError
        }
      }

      toast({
        title: initialData ? "تم تحديث الطلب" : "تم حفظ الطلب",
        description: initialData ? "تم تحديث طلب التمويل بنجاح" : "تم حفظ طلب التمويل بنجاح",
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting funding request:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الطلب",
        variant: "destructive",
      })
    }
  }

  const nextStep = () => {
    const currentStepFields = {
      1: ["title", "category", "funding_goal", "campaign_duration", "description", "fund_usage_plan"],
      2: ["business_plan", "financial_statements"],
      3: [],
    }[step]

    const isValid = currentStepFields.every((field) => {
      const value = form.getValues(field)
      return value && (!["description", "fund_usage_plan"].includes(field) || value.length >= 50)
    })

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3))
    } else {
      toast({
        title: "تحقق من البيانات",
        description: "يرجى إكمال جميع الحقول المطلوبة",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          {step === 1 && <BasicInfoStep control={form.control} />}
          {step === 2 && <DocumentsStep control={form.control} />}
          {step === 3 && <PaymentStep amount={form.getValues("funding_goal")} control={form.control} />}

          <div className="flex justify-between mt-6">
            {step === 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                إلغاء
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
              >
                السابق
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                التالي
              </Button>
            ) : (
              <Button type="submit">
                {initialData ? "حفظ التعديلات" : "إرسال الطلب"}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </Form>
  )
}