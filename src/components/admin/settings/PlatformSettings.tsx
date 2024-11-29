import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Settings, Lock, TrendingUp, Building2 } from "lucide-react"
import { GeneralSettings } from "./sections/GeneralSettings"
import { InvestmentSettings } from "./sections/InvestmentSettings"
import { SecuritySettings } from "./sections/SecuritySettings"
import { BankAccountSettings } from "./sections/BankAccountSettings"

export function PlatformSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const { data: settings } = useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
      
      if (error) throw error
      return data || []
    }
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث إعدادات المنصة بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-800">إعدادات المنصة</h2>
        <p className="text-muted-foreground">
          إدارة إعدادات وتكوين المنصة
        </p>
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-card p-1 rounded-lg border shadow-sm w-full flex justify-end space-x-2">
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 px-6 py-3"
            >
              <Lock className="h-4 w-4" />
              الأمان
            </TabsTrigger>
            <TabsTrigger 
              value="bank" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 px-6 py-3"
            >
              <Building2 className="h-4 w-4" />
              الحسابات البنكية
            </TabsTrigger>
            <TabsTrigger 
              value="investments" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 px-6 py-3"
            >
              <TrendingUp className="h-4 w-4" />
              الاستثمارات
            </TabsTrigger>
            <TabsTrigger 
              value="general" 
              className="flex items-center gap-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 px-6 py-3"
            >
              <Settings className="h-4 w-4" />
              عام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-0">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="investments" className="mt-0">
            <InvestmentSettings />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="bank" className="mt-0">
            <BankAccountSettings />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button 
            disabled={isLoading}
            onClick={handleSave}
            className="px-8"
          >
            حفظ التغييرات
          </Button>
        </div>
      </div>
    </div>
  )
}