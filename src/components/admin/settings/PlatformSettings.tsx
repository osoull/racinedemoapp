import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Settings, Lock, TrendingUp } from "lucide-react"

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

  const handleSave = async (category: string, key: string, value: any) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ setting_value: value })
        .eq('category', category)
        .eq('setting_key', key)

      if (error) throw error

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
    <div className="container mx-auto py-6" dir="rtl">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-bold">إعدادات المنصة</h1>
        <p className="text-muted-foreground">إدارة إعدادات وتكوين المنصة</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-end p-0 bg-transparent space-x-2">
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 px-6 py-3 rounded-lg"
          >
            <Lock className="h-4 w-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger 
            value="investments" 
            className="flex items-center gap-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 px-6 py-3 rounded-lg"
          >
            <TrendingUp className="h-4 w-4" />
            الاستثمارات
          </TabsTrigger>
          <TabsTrigger 
            value="general" 
            className="flex items-center gap-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 px-6 py-3 rounded-lg"
          >
            <Settings className="h-4 w-4" />
            عام
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="max-w-2xl mr-auto">
            <CardHeader className="text-right">
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>
                إدارة الإعدادات العامة للمنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="platform-name">اسم المنصة</Label>
                <Input
                  id="platform-name"
                  defaultValue="رسين"
                  className="w-[180px] text-right"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>وضع الصيانة</Label>
                  <div className="text-[0.8rem] text-muted-foreground">
                    تفعيل وضع الصيانة للمنصة
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="max-w-2xl mr-auto">
            <CardHeader className="text-right">
              <CardTitle>إعدادات الاستثمار</CardTitle>
              <CardDescription>
                تكوين حدود وقواعد الاستثمار
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="min-investment">الحد الأدنى للاستثمار</Label>
                <Input
                  id="min-investment"
                  type="number"
                  defaultValue="1000"
                  className="w-[180px] text-right"
                  dir="ltr"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="max-investment">الحد الأقصى للاستثمار</Label>
                <Input
                  id="max-investment"
                  type="number"
                  defaultValue="50000"
                  className="w-[180px] text-right"
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="max-w-2xl mr-auto">
            <CardHeader className="text-right">
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان والخصوصية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label>التحقق بخطوتين</Label>
                  <div className="text-[0.8rem] text-muted-foreground">
                    تفعيل التحقق بخطوتين للمستخدمين
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>تأكيد البريد الإلكتروني</Label>
                  <div className="text-[0.8rem] text-muted-foreground">
                    طلب تأكيد البريد الإلكتروني عند التسجيل
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button disabled={isLoading}>
          حفظ التغييرات
        </Button>
      </div>
    </div>
  )
}