import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function GeneralSettings() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const { data: settings } = useQuery({
    queryKey: ['platform-settings', 'general'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('category', 'general')
      
      if (error) throw error
      return data?.reduce((acc: any, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      }, {}) || {}
    }
  })

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          category: 'general',
          description: getSettingDescription(key)
        })
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] })
      toast({
        title: "تم الحفظ",
        description: "تم تحديث الإعدادات بنجاح",
      })
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      })
    }
  })

  const getSettingDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      platform_name: "اسم المنصة",
      maintenance_mode: "وضع الصيانة",
      support_email: "البريد الإلكتروني للدعم",
      require_2fa: "تفعيل المصادقة الثنائية للمستخدمين"
    }
    return descriptions[key]
  }

  const handleSave = async (key: string, value: any) => {
    setIsLoading(true)
    try {
      await updateSetting.mutateAsync({ key, value })
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAChange = async (checked: boolean) => {
    setIsLoading(true)
    try {
      // Update Supabase auth settings using the correct admin API
      const { error: authError } = await supabase.auth.admin.setConfig({
        mfa: {
          enabled: checked,
          default_enabled: checked
        }
      })
      
      if (authError) throw authError

      // Update platform settings
      await updateSetting.mutateAsync({ key: 'require_2fa', value: checked })
      
      toast({
        title: "تم التحديث",
        description: checked 
          ? "تم تفعيل المصادقة الثنائية للمستخدمين الجدد" 
          : "تم تعطيل المصادقة الثنائية للمستخدمين الجدد",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث إعدادات المصادقة الثنائية",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>اسم المنصة</Label>
          <Input
            defaultValue={settings?.platform_name}
            onBlur={(e) => handleSave('platform_name', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>وضع الصيانة</Label>
            <p className="text-sm text-muted-foreground">
              تفعيل وضع الصيانة للمنصة
            </p>
          </div>
          <Switch
            checked={settings?.maintenance_mode}
            onCheckedChange={(checked) => handleSave('maintenance_mode', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>البريد الإلكتروني للدعم</Label>
          <Input
            type="email"
            defaultValue={settings?.support_email}
            onBlur={(e) => handleSave('support_email', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>المصادقة الثنائية</Label>
            <p className="text-sm text-muted-foreground">
              تفعيل المصادقة الثنائية للمستخدمين الجدد
            </p>
          </div>
          <Switch
            checked={settings?.require_2fa}
            onCheckedChange={handle2FAChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button disabled={isLoading} className="w-full">
        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </div>
  )
}