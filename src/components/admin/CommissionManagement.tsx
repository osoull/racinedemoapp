import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { CommissionCard } from "./commission/CommissionCard"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

type Commission = Tables<"commissions">

const CommissionManagement = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
        .order('commission_type', { ascending: true })

      if (error) throw error
      return data as Commission[]
    },
  })

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('commission_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'commissions'
        },
        (payload) => {
          // Invalidate and refetch when we receive a change
          queryClient.invalidateQueries({ queryKey: ["commissions"] })
          
          toast({
            title: "تم تحديث العمولة",
            description: "تم تحديث معدل العمولة بنجاح",
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, toast])

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