import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tables } from "@/integrations/supabase/types"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Commission = Tables<"commissions">

interface CommissionCardProps {
  commission: Commission
  getArabicCommissionType: (type: string) => string
}

export const CommissionCard = ({ commission, getArabicCommissionType }: CommissionCardProps) => {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [newRate, setNewRate] = useState(commission.rate.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const validateRate = (rate: string): boolean => {
    const rateNumber = parseFloat(rate)
    return !isNaN(rateNumber) && rateNumber >= 0 && rateNumber <= 100
  }

  const handleSave = async () => {
    if (!validateRate(newRate)) {
      setError("يرجى إدخال نسبة صحيحة بين 0 و 100")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const { error: updateError } = await supabase
        .from("commissions")
        .update({ 
          rate: parseFloat(newRate),
          updated_at: new Date().toISOString()
        })
        .eq("commission_id", commission.commission_id)

      if (updateError) throw updateError

      setIsEditing(false)
      
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["commissions"] })
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث معدل العمولة بنجاح",
      })
    } catch (error) {
      console.error("Error updating commission rate:", error)
      setError("حدث خطأ أثناء تحديث معدل العمولة")
      setNewRate(commission.rate.toString())
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معدل العمولة",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setNewRate(commission.rate.toString())
    setError(null)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {getArabicCommissionType(commission.commission_type)}
            </h3>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newRate}
                    onChange={(e) => {
                      setNewRate(e.target.value)
                      setError(null)
                    }}
                    className="w-24 text-right"
                    min="0"
                    max="100"
                    step="0.01"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <span>%</span>
                </div>
                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                النسبة: {commission.rate}%
              </p>
            )}
          </div>
          <div className="space-x-2 flex flex-row-reverse">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  disabled={isSubmitting || !validateRate(newRate)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="mr-2"
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                تعديل
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}