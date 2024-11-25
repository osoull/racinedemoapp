import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvestorList } from "./InvestorList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

export function InvestorManagement() {
  const { data: investors, isLoading } = useQuery({
    queryKey: ["investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          investor_kyc (*)
        `)
        .eq("user_type", "investor")

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستثمرين</CardTitle>
      </CardHeader>
      <CardContent>
        <InvestorList investors={investors} />
      </CardContent>
    </Card>
  )
}