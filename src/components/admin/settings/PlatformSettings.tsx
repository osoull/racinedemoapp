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
        <TabsList className="justify-start">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="investments">الاستثمارات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>
                إدارة الإعدادات العامة للمنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-reverse space-x-2">
                <Label htmlFor="platform-name" className="text-right">اسم المنصة</Label>
                <Input
                  id="platform-name"
                  defaultValue="رسين"
                  className="w-[180px] text-right"
                />
              </div>
              <div className="flex items-center justify-between space-x-reverse space-x-2">
                <div className="space-y-0.5 text-right">
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
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الاستثمار</CardTitle>
              <CardDescription>
                تكوين حدود وقواعد الاستثمار
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-reverse space-x-2">
                <Label htmlFor="min-investment" className="text-right">الحد الأدنى للاستثمار</Label>
                <Input
                  id="min-investment"
                  type="number"
                  defaultValue="1000"
                  className="w-[180px] text-right"
                  dir="ltr"
                />
              </div>
              <div className="flex items-center justify-between space-x-reverse space-x-2">
                <Label htmlFor="max-investment" className="text-right">الحد الأقصى للاستثمار</Label>
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
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان والخصوصية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-reverse space-x-2">
                <div className="space-y-0.5 text-right">
                  <Label>التحقق بخطوتين</Label>
                  <div className="text-[0.8rem] text-muted-foreground">
                    تفعيل التحقق بخطوتين للمستخدمين
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between space-x-reverse space-x-2">
                <div className="space-y-0.5 text-right">
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

      <div className="mt-6 flex justify-start">
        <Button disabled={isLoading}>
          حفظ التغييرات
        </Button>
      </div>
    </div>
  )
}