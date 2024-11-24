import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KYCHistoryEntry {
  id: string;
  user_id: string | null;
  old_status: string | null;
  new_status: string | null;
  changed_by: string | null;
  notes: string | null;
  created_at: string | null;
  user: {
    first_name: string;
    last_name: string;
  };
  admin: {
    first_name: string;
    last_name: string;
  };
}

export function KYCStatusHistory() {
  const { data: history, isLoading } = useQuery<KYCHistoryEntry[]>({
    queryKey: ['kyc-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_status_history')
        .select(`
          *,
          user:user_id (
            first_name,
            last_name
          ),
          admin:changed_by (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Transform the data to match KYCHistoryEntry type
      return (data as any[]).map(entry => ({
        ...entry,
        user: entry.user?.[0] || { first_name: 'Unknown', last_name: 'User' },
        admin: entry.admin?.[0] || { first_name: 'Unknown', last_name: 'Admin' }
      }))
    }
  })

  if (isLoading) {
    return <div>جاري التحميل...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل التغييرات</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {history?.map((entry) => (
              <div key={entry.id} className="border-b pb-2">
                <p className="font-medium">
                  {entry.user.first_name} {entry.user.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  تم تغيير الحالة من {entry.old_status} إلى {entry.new_status}
                </p>
                <p className="text-sm text-muted-foreground">
                  بواسطة: {entry.admin.first_name} {entry.admin.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.created_at || '').toLocaleString('ar-SA')}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}