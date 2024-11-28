import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Users, Wallet } from "lucide-react"
import { InvestorSection } from "./sections/InvestorSection"
import { InvestmentSection } from "./sections/InvestmentSection"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function InvestorManagement() {
  const { data: investors, isLoading: isLoadingInvestors } = useQuery({
    queryKey: ["investors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          investor_kyc (*)
        `)
        .in("user_type", ["basic_investor", "qualified_investor"])

      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المستثمرين والاستثمارات</h2>
          <p className="text-muted-foreground">
            إدارة وتتبع المستثمرين واستثماراتهم في المنصة
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Download className="ml-2 h-4 w-4" />
          تصدير البيانات
        </Button>
      </div>

      <Tabs defaultValue="investors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="investors">
            <Users className="h-4 w-4 ml-2" />
            المستثمرون
          </TabsTrigger>
          <TabsTrigger value="investments">
            <Wallet className="h-4 w-4 ml-2" />
            الاستثمارات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investors">
          <InvestorSection investors={investors || []} isLoading={isLoadingInvestors} />
        </TabsContent>

        <TabsContent value="investments">
          <InvestmentSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}