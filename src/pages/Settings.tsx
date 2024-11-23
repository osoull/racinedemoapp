import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات بنجاح",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>الإعدادات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>إشعارات البريد الإلكتروني</Label>
                <p className="text-sm text-muted-foreground">
                  تلقي إشعارات عبر البريد الإلكتروني
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>المصادقة الثنائية</Label>
                <p className="text-sm text-muted-foreground">
                  تفعيل المصادقة الثنائية لحسابك
                </p>
              </div>
              <Switch
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            حفظ التغييرات
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}