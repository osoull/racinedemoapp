import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface RiskRatingManagerProps {
  projectId: string
  currentRating?: string
  currentDescription?: string
}

export function RiskRatingManager({ 
  projectId, 
  currentRating, 
  currentDescription 
}: RiskRatingManagerProps) {
  const [rating, setRating] = useState(currentRating || "")
  const [description, setDescription] = useState(currentDescription || "")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const updateRiskRating = useMutation({
    mutationFn: async ({ rating, description }: { rating: string; description: string }) => {
      const { error } = await supabase
        .from("funding_requests")
        .update({
          risk_rating: rating,
          risk_description: description
        })
        .eq("id", projectId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funding-request", projectId] })
      toast({
        title: "تم تحديث تقييم المخاطر",
        description: "تم تحديث تقييم المخاطر بنجاح"
      })
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث تقييم المخاطر",
        variant: "destructive"
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateRiskRating.mutate({ rating, description })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">تقييم المخاطر</Label>
        <Input
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="مثال: مرتفع، متوسط، منخفض"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف المخاطر</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف تفصيلي للمخاطر"
        />
      </div>

      <Button 
        type="submit" 
        disabled={updateRiskRating.isPending}
      >
        {updateRiskRating.isPending ? "جاري التحديث..." : "تحديث التقييم"}
      </Button>
    </form>
  )
}