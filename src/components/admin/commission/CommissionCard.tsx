import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tables } from "@/integrations/supabase/types"
import { useCommissionUpdates } from "@/hooks/useCommissionUpdates"
import { useToast } from "@/hooks/use-toast"

type Commission = Tables<"commissions">

interface CommissionCardProps {
  commission: Commission
  getArabicCommissionType: (type: string) => string
}

export const CommissionCard = ({ commission, getArabicCommissionType }: CommissionCardProps) => {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [newRate, setNewRate] = useState(commission.rate.toString())
  const { updateCommissionRate } = useCommissionUpdates()

  const handleSave = async () => {
    const rateNumber = parseFloat(newRate)
    if (isNaN(rateNumber) || rateNumber < 0 || rateNumber > 100) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال نسبة صحيحة بين 0 و 100",
        variant: "destructive",
      })
      return
    }

    try {
      await updateCommissionRate(commission.commission_id, rateNumber)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating commission rate:", error)
      // Reset to original value on error
      setNewRate(commission.rate.toString())
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">
              {getArabicCommissionType(commission.commission_type)}
            </h3>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-24 text-right"
                  min="0"
                  max="100"
                  step="0.01"
                  dir="ltr"
                />
                <span>%</span>
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
                <Button onClick={handleSave}>
                  حفظ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setNewRate(commission.rate.toString())
                  }}
                  className="mr-2"
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