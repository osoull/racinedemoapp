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
  const [formData, setFormData] = useState({
    platform_name: '',
    maintenance_mode: false,
    support_email: '',
    require_2fa: false
  })

  const { data: settings } = useQuery({
    queryKey: ['platform-settings', 'general'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('category', 'general')
      
      if (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل الإعدادات",
          variant: "destructive",
        })
        throw error
      }

      const settingsMap = data?.reduce((acc: any, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      }, {}) || {}

      setFormData({
        platform_name: settingsMap.platform_name || '',
        maintenance_mode: settingsMap.maintenance_mode || false,
        support_email: settingsMap.support_email || '',
        require_2fa: settingsMap.require_2fa || false
      })

      return settingsMap
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
        }, {
          onConflict: 'setting_key,category'
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
    onError: (error) => {
      console.error('Error updating setting:', error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await Promise.all([
        updateSetting.mutateAsync({ 
          key: 'platform_name', 
          value: formData.platform_name 
        }),
        updateSetting.mutateAsync({ 
          key: 'maintenance_mode', 
          value: formData.maintenance_mode 
        }),
        updateSetting.mutateAsync({ 
          key: 'support_email', 
          value: formData.support_email 
        }),
        updateSetting.mutateAsync({ 
          key: 'require_2fa', 
          value: formData.require_2fa 
        })
      ])
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>اسم المنصة</Label>
          <Input
            value={formData.platform_name}
            onChange={(e) => setFormData(prev => ({ ...prev, platform_name: e.target.value }))}
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
            checked={formData.maintenance_mode}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, maintenance_mode: checked }))}
          />
        </div>

        <div className="space-y-2">
          <Label>البريد الإلكتروني للدعم</Label>
          <Input
            type="email"
            value={formData.support_email}
            onChange={(e) => setFormData(prev => ({ ...prev, support_email: e.target.value }))}
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
            checked={formData.require_2fa}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, require_2fa: checked }))}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  )
}