import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription"
import { CommissionCard } from "./commission/CommissionCard"

type Commission = Tables<"commissions">

const CommissionManagement = () => {
  const queryClient = useQueryClient()

  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")

      if (error) throw error
      return data as Commission[]
    },
  })

  useRealtimeSubscription(
    "commissions",
    {
      onUpdate: () => {
        queryClient.invalidateQueries({ queryKey: ["commissions"] })
      },
      onInsert: () => {
        queryClient.invalidateQueries({ queryKey: ["commissions"] })
      },
      onDelete: () => {
        queryClient.invalidateQueries({ queryKey: ["commissions"] })
      }
    }
  )

  const getArabicCommissionType = (type: string) => {
    switch (type) {
      case "admin_fee":
        return "عمولة الإدارة"
      case "collection_fee":
        return "عمولة التحصيل"
      case "basic_investor_fee":
        return "عمولة المستثمر الأساسي"
      case "qualified_investor_fee":
        return "عمولة المستثمر المؤهل"
      case "funding_request":
        return "رسوم طلب التمويل"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>العمولات والرسوم</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>جاري التحميل...</div>
        ) : (
          <div className="space-y-4" dir="rtl">
            {commissions?.map((commission) => (
              <CommissionCard 
                key={commission.commission_id} 
                commission={commission}
                getArabicCommissionType={getArabicCommissionType}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CommissionManagement