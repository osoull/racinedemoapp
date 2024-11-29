import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BasicInfoStep } from "./steps/BasicInfoStep"
import { DocumentsStep } from "./steps/DocumentsStep"
import { PaymentStep } from "./steps/PaymentStep"
import { useProjectSubmission } from "@/hooks/useProjectSubmission"
import { calculateFees } from "@/utils/feeCalculations"

interface FundingRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FundingRequestForm({ onSuccess, onCancel }: FundingRequestFormProps) {
  const [step, setStep] = useState(1)
  const { form, onSubmit, isSubmitting } = useProjectSubmission()

  const handleNext = async () => {
    const isValid = await form.trigger()
    if (isValid) setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (data: any) => {
    await onSubmit(data)
    onSuccess?.()
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {step === 1 && (
          <div className="space-y-6">
            <BasicInfoStep control={form.control} />
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                إلغاء
              </Button>
              <Button type="button" onClick={handleNext}>
                التالي
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <DocumentsStep control={form.control} />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                السابق
              </Button>
              <Button type="button" onClick={handleNext}>
                التالي
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <PaymentStep 
              amount={form.getValues("funding_goal") || 0}
              control={form.control}
            />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                السابق
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  )
}