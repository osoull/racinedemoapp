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
      const { data: investments } = await supabase
        .from("investments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      // Combine and sort activities
      return [...(investments || []), ...(projects || [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
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
                    {activity.title || `استثمار جديد: ${activity.amount} ريال`}
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