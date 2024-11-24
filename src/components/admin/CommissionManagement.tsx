import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { CommissionCard } from "./commission/CommissionCard"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type Commission = Tables<"commissions">

const CommissionManagement = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

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

  // Configuration de la souscription en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('commission-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commissions'
        },
        (payload) => {
          // Mise à jour optimiste du cache
          if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(['commissions'], (oldData: Commission[] | undefined) => {
              if (!oldData) return oldData
              return oldData.map(commission => 
                commission.commission_id === payload.new.commission_id 
                  ? payload.new as Commission
                  : commission
              )
            })

            toast({
              title: "تم تحديث العمولة",
              description: "تم تحديث معدل العمولة بنجاح",
            })
          }
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