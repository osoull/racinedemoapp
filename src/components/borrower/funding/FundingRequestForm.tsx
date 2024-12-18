import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { BasicInfoStep } from "./steps/BasicInfoStep"
import { DocumentsStep } from "./steps/DocumentsStep"
import { PaymentStep } from "./steps/PaymentStep"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { FundingRequest } from "@/types/funding"
import { fundingRequestSchema, FundingRequestFormData } from "./types"
import { useFundingRequestSubmit } from "./hooks/useFundingRequestSubmit"

export interface FundingRequestFormProps {
  initialData?: FundingRequest;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FundingRequestForm({ initialData, onSuccess, onCancel }: FundingRequestFormProps) {
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const { user } = useAuth()
  const { handleSubmit: submitFundingRequest } = useFundingRequestSubmit(initialData, onSuccess)

  const form = useForm<FundingRequestFormData>({
    resolver: zodResolver(fundingRequestSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      category: initialData.category,
      funding_goal: initialData.funding_goal,
      campaign_duration: initialData.campaign_duration,
      description: initialData.description,
      fund_usage_plan: initialData.fund_usage_plan,
      business_plan: initialData.business_plan,
      financial_statements: initialData.financial_statements,
      additional_documents: initialData.additional_documents,
    } : {
      title: "",
      category: "",
      funding_goal: 0,
      campaign_duration: 30,
      description: "",
      fund_usage_plan: "",
    },
  })

  const onSubmit = (values: FundingRequestFormData) => {
    submitFundingRequest(values, user?.id)
  }

  const nextStep = () => {
    type StepFields = readonly (keyof FundingRequestFormData)[]
    
    const currentStepFields: Record<number, StepFields> = {
      1: ["title", "category", "funding_goal", "campaign_duration", "description", "fund_usage_plan"],
      2: ["business_plan", "financial_statements"],
      3: [],
    }

    const isValid = currentStepFields[step].every((field) => {
      const value = form.getValues(field)
      if (typeof value === "string") {
        return value && (!["description", "fund_usage_plan"].includes(field) || value.length >= 50)
      }
      return value !== undefined && value !== null && value > 0
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