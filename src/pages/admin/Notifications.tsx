import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle2 } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export default function Notifications() {
  const { user } = useAuth()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const markAllAsRead = async () => {
    if (!user) return

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <BackButton />
        <Button onClick={markAllAsRead} variant="outline" size="sm">
          تحديد الكل كمقروء
          <CheckCircle2 className="mr-2 h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">جاري التحميل...</div>
          ) : notifications?.length === 0 ? (
            <div className="text-center text-muted-foreground">لا توجد إشعارات</div>
          ) : (
            notifications?.map((notification) => (
              <div
                key={notification.notification_id}
                className={`rounded-lg border p-4 ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(notification.date), "dd/MM/yyyy HH:mm")}
                  </time>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}