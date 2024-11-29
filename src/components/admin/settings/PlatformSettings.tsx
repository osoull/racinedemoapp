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
import { Settings, Lock, TrendingUp, ArrowLeft } from "lucide-react"

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
    <div className="container mx-auto p-6" dir="rtl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">إعدادات المنصة</h1>
            <p className="text-muted-foreground mt-2">إدارة إعدادات وتكوين المنصة</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Button>
        </div>
      </div>

      {/* Main Content */}
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

        <div className="grid gap-6">
          <TabsContent value="general" className="mt-0">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-2xl">الإعدادات العامة</CardTitle>
                <CardDescription>
                  إدارة الإعدادات العامة للمنصة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-sm">
                    <Label htmlFor="platform-name" className="text-right block mb-2">اسم المنصة</Label>
                    <Input
                      id="platform-name"
                      defaultValue="رسين"
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>وضع الصيانة</Label>
                    <div className="text-sm text-muted-foreground">
                      تفعيل وضع الصيانة للمنصة
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments" className="mt-0">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-2xl">إعدادات الاستثمار</CardTitle>
                <CardDescription>
                  تكوين حدود وقواعد الاستثمار
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 max-w-sm">
                  <div className="space-y-2">
                    <Label htmlFor="min-investment">الحد الأدنى للاستثمار</Label>
                    <Input
                      id="min-investment"
                      type="number"
                      defaultValue="1000"
                      className="text-right"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-investment">الحد الأقصى للاستثمار</Label>
                    <Input
                      id="max-investment"
                      type="number"
                      defaultValue="50000"
                      className="text-right"
                      dir="ltr"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-2xl">إعدادات الأمان</CardTitle>
                <CardDescription>
                  إدارة إعدادات الأمان والخصوصية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>التحقق بخطوتين</Label>
                    <div className="text-sm text-muted-foreground">
                      تفعيل التحقق بخطوتين للمستخدمين
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>تأكيد البريد الإلكتروني</Label>
                    <div className="text-sm text-muted-foreground">
                      طلب تأكيد البريد الإلكتروني عند التسجيل
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button 
          disabled={isLoading}
          className="px-8"
        >
          حفظ التغييرات
        </Button>
      </div>
    </div>
  )
}