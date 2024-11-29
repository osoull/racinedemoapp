import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function GeneralSettings() {
  return (
    <Card className="border-2 border-muted">
      <CardHeader>
        <CardTitle className="text-2xl text-right">الإعدادات العامة</CardTitle>
        <CardDescription className="text-right">
          إدارة الإعدادات العامة للمنصة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-end">
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
          <Switch />
          <div className="space-y-1 text-right">
            <Label>وضع الصيانة</Label>
            <div className="text-sm text-muted-foreground">
              تفعيل وضع الصيانة للمنصة
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}