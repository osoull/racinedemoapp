import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function SecuritySettings() {
  return (
    <Card className="border-2 border-muted">
      <CardHeader>
        <CardTitle className="text-2xl text-right">إعدادات الأمان</CardTitle>
        <CardDescription className="text-right">
          إدارة إعدادات الأمان والخصوصية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Switch />
          <div className="space-y-1 text-right">
            <Label>التحقق بخطوتين</Label>
            <div className="text-sm text-muted-foreground">
              تفعيل التحقق بخطوتين للمستخدمين
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Switch />
          <div className="space-y-1 text-right">
            <Label>تأكيد البريد الإلكتروني</Label>
            <div className="text-sm text-muted-foreground">
              طلب تأكيد البريد الإلكتروني عند التسجيل
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}