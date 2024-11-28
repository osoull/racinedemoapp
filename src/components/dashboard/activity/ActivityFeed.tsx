import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export function ActivityFeed() {
  const { user } = useAuth()

  const { data: activities } = useQuery({
    queryKey: ["activities", user?.id],
    queryFn: async () => {
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      return transactions
    },
    enabled: !!user?.id
  })

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>النشاط الأخير</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {activity.type === 'deposit' ? 'إيداع' : 'سحب'}: {activity.amount} ريال
                  </p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString('ar-SA')}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}